import { Dropbox } from 'dropbox';

const dropbox = new Dropbox({
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
});

const service = {

    upload: (filePath, contents) => {
        return dropbox.filesUpload({
            path: filePath,
            contents
        })
    }
}

export default service;