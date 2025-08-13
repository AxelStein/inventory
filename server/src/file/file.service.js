import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';

export const s3Client = new S3Client();

export const fileService = {

    upload: (key, mimetype, buffer) => {
        return new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.AWS_BUCKET,
                Key: key,
                Body: buffer,
                ContentType: mimetype
            }
        }).done();
    },

    delete: (key) => s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key
    })),

    signUrl: (key) => getSignedUrl(s3Client, new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
    }), { expiresIn: 3600 })
}