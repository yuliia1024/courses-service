const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { AWS_S3 } = require('../../config');

const s3Client = new S3Client({
  region: AWS_S3.region,
});

const uploadFileS3 = async (path, data, contentType) => {
  const params = {
    Bucket: AWS_S3.bucketName,
    Key: path,
    Body: data,
    ContentType: contentType,
  };

  await s3Client.send(new PutObjectCommand(params));
};

const getFileS3 = async path => {
  const params = {
    Bucket: AWS_S3.bucketName,
    Key: path,
  };

  const result = await s3Client.send(new GetObjectCommand(params));

  return result.Body;
};

const deleteFileS3 = async path => {
  const params = {
    Bucket: AWS_S3.bucketName,
    Key: path,
  };

  await s3Client.send(new DeleteObjectCommand(params));
};

module.exports = {
  uploadFileS3,
  getFileS3,
  deleteFileS3,
};
