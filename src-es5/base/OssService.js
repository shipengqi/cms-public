/**
 * Created by shipengqi on 17-1-7.
 */

var ALY = require('aliyun-sdk');
var uuid = require('uuid');
var fs = require('fs');
var ossUpload = require('aliyun-oss-upload-stream');
var path = require('path');
var moment = require('moment');
var Q = require('q');
var contants = require('../contants/contants');
var OSS_BUCKET = contants.OSS_BUCKET;
var OSS_ORIGIN_NAME = contants.OSS_ORIGIN_NAME;

function OssService() {
    this.ossHd = null;
}

OssService.prototype.initOSSClient = function (ossPara) {
    this.ossHd = new ALY.OSS(ossPara);
    console.log(`init OSS client success`);
};

OssService.prototype.uploadImg = function (imagePath) {
    var defer = Q.defer();
    var ossStream = ossUpload(this.ossHd);
    var fileName = "handwork_"+moment().format('YYYYMMDD')+"/"+uuid.v1()+path.extname(imagePath);
    var upload = ossStream.upload({
        Bucket: OSS_BUCKET,
        Key: fileName
    });

    upload.on('error', function (error) {
        console.error('error:', error);
        defer.reject(error);
    });

    upload.on('part', function (part) {

    });

    upload.on('uploaded', function (details) {
        details.Location = OSS_ORIGIN_NAME+fileName;
        defer.resolve(details.Location);
    });

    var read = fs.createReadStream(imagePath);
    read.pipe(upload);

    return defer.promise;

};

module.exports = new OssService();