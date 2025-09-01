import multer from 'multer';
import { ValidationError } from '../error/index.js';
import { appConfig } from '../app/app.config.js';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import mime from 'mime-types';

const s3Client = new S3Client();

const imageConstraints = appConfig.inventory.imageConstraints;

const config = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET,
        metadata: (req, file, cb) => cb(null, { originalname: file.originalname }),
        key: (req, file, cb) => cb(null, `${crypto.randomUUID()}.${mime.extension(file.mimetype)}`)
    }),
    limits: { fileSize: imageConstraints.maxFileSize },
    fileFilter: (req, file, callback) => {
        if (imageConstraints.mimeTypes.find(e => e === file.mimetype) != null) {
            callback(null, true);
        } else {
            callback(new ValidationError(__('image.error.invalidMimeType', imageConstraints.mimeTypes.join(', '))), false);
        }
    }
});

export default config.single('file');