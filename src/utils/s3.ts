import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadFileToS3 = async (file: Express.Multer.File, folder: string) => {
  const extension = file.originalname.split('.').pop();
  const key = `${folder}/${uuidv4()}.${extension}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET || '',
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
  await s3.upload(params).promise();
  return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
