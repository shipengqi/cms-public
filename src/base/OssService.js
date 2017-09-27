/**
 * Created by shipengqi on 17-1-7.
 */

import ALY from 'aliyun-sdk';
import fs from 'fs';
import uuid from 'uuid';
import ossUpload from 'aliyun-oss-upload-stream';
import path from 'path';
import moment from 'moment';
import {OSS_BUCKET,OSS_ORIGIN_NAME} from '../contants/contants';

class OssService{

    constructor() {
        this.ossHd = null;
        this.instance = null;
    }

    initOSSClient(ossPara) {
        this.ossHd = new ALY.OSS(ossPara);
        console.log(`init OSS client success`);
    }

    uploadImg(imagePath) {
        let self = this;
        return new Promise((resolve,reject) => {
            let ossStream = ossUpload(self.ossHd);
            let fileName = `handwork_${moment().format('YYYYMMDD')}/${uuid.v1()}.${path.extname}`;
            let upload = ossStream.upload({
                Bucket: OSS_BUCKET,
                Key: fileName
            });

            upload.on('error', function (error) {
                console.warn('error:', error);
                reject(error);
            });

            upload.on('part', function (part) {

            });

            upload.on('uploaded', function (details) {
                details.Location = OSS_ORIGIN_NAME+fileName;
                resolve(details.Location);
            });

            let read = fs.createReadStream(imagePath);
            read.pipe(upload);
        })
    }

    static getInstance () {
        let instance = this.instance;
        if (!instance) {
            instance = new OssService();
        }
        return instance;
    }

}


export default OssService;