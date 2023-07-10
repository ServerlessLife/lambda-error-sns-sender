import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as archiver from 'archiver';
import * as tmp from 'tmp';
import YAML from 'yaml';

const bucketName = 'lambda-error-sns-sender';
const region = 'eu-west-1';
const cloudFromationOutputYamlFileName = 'lambda-error-sns-sender.yaml';

interface Assets {
  files: Record<
    string,
    {
      source: {
        path: string;
        packaging: string;
      };
      destinations: {
        'current_account-current_region': {
          bucketName: string;
          objectKey: string;
        };
      };
    }
  >;
}

const s3Client = new S3Client({ region });

async function run() {
  const jsonFile = fs.readFileSync(
    'cdk.out/lambda-error-sns-sender-cf.assets.json',
    'utf-8'
  );
  const assets: Assets = JSON.parse(jsonFile);
  const assetsFiles: string[] = [];
  let cloudFromationTemplateFile: string | undefined;

  for (const key of Object.keys(assets.files)) {
    const file = assets.files[key];
    const packaging = file.source.packaging;
    const destination = file.destinations['current_account-current_region'];
    const objectKey = destination.objectKey;
    const sourcePath = file.source.path;

    const fullPath = path.join('cdk.out', sourcePath);

    if (packaging === 'zip') {
      // zip folder with library
      await uploadZipToS3(fullPath, objectKey);
      assetsFiles.push(objectKey);
    } else if (sourcePath === 'lambda-error-sns-sender-cf.template.json') {
      cloudFromationTemplateFile = fullPath;
    } else {
      await uploadFileToS3(fullPath, objectKey);
    }
  }

  if (!cloudFromationTemplateFile) {
    throw new Error('cloudFromationTemplateFile not found');
  }

  await convertToYamlAndUploadZipToS3(
    cloudFromationTemplateFile,
    cloudFromationOutputYamlFileName,
    assetsFiles
  );
}

async function convertToYamlAndUploadZipToS3(
  fullPath: string,
  objectKey: string,
  assetsFiles: string[]
) {
  console.log(`Converting to yaml and uploading ${fullPath} to ${objectKey}`);

  // read json
  const jsonString = fs.readFileSync(fullPath, 'utf-8');
  const json = JSON.parse(jsonString);

  for (const key in json.Resources) {
    const resource = json.Resources[key];
    //console.log(`** Resource ${key} is ${JSON.stringify(resource)}`);
    const s3Key = resource.Properties?.Code?.S3Key;
    //console.log(`Checking ${key} for ${s3Key}`);

    if (s3Key && assetsFiles.includes(s3Key)) {
      console.log(
        `Replacing ${JSON.stringify(
          json.Resources[key].Properties.Code.S3Bucket
        )} with ${bucketName} for resource ${s3Key}`
      );
      json.Resources[key].Properties.Code.S3Bucket = bucketName;
    }
  }

  const yaml = YAML.stringify(json);

  await uploadToS3(yaml, objectKey);
}

async function uploadZipToS3(fullPath: string, objectKey: string) {
  console.log(`Ziping and uploading ${fullPath} to ${objectKey}`);

  await new Promise((resolve, reject) => {
    try {
      tmp.file(async (err, zipFilePath, _fd, cleanupCallback) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          await zipFolder(fullPath, zipFilePath);
          await uploadFileToS3(zipFilePath, objectKey);
          cleanupCallback();
          resolve(undefined);
        } catch (err2) {
          reject(err2);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function uploadFileToS3(filePath: string, objectKey: string) {
  console.log(`Uploading ${filePath} to ${objectKey}`);

  const fileStream = fs.createReadStream(filePath);

  await uploadToS3(fileStream, objectKey);
}

async function uploadToS3(body: fs.ReadStream | string, objectKey: string) {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: body,
    //ACL: 'public-read',
  };

  await s3Client.send(new PutObjectCommand(params));
}

async function zipFolder(
  sourceFolder: string,
  zipFilePath: string
): Promise<void> {
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver.create('zip', {
    zlib: { level: 9 },
  });

  await new Promise(async (resolve, reject) => {
    try {
      archive
        .directory(sourceFolder, false)
        .on('error', (err) => reject(err))
        .pipe(output);

      output.on('close', () => resolve(undefined));
      await archive.finalize();
    } catch (err) {
      reject(err);
    }
  });
}

run().catch(console.error);
