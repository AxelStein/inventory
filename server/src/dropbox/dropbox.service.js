import { Dropbox } from 'dropbox';

const dropbox = new Dropbox({
    clientId: process.env.DROPBOX_CLIENT_ID,
    clientSecret: process.env.DROPBOX_CLIENT_SECRET,
    refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
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