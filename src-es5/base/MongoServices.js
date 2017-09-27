/**
 * Created by shipengqi on 17-1-7.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var _isArray = require('lodash/isArray');

function MongoServices() {
    this.mongoHds = {};
}

MongoServices.prototype.connectMongodb = function (mongoParas) {
    if(!this.validateParams(mongoParas)){
        return;
    }
    var self = this;
    var options = {
        'db': {'readPreference': 'secondaryPreferred'}
    };
    mongoParas.forEach(function (i) {
        var para = i;
        var coon = mongoose.createConnection(para.uri, options);
        coon.on('connected', function() {
            self.mongoHds[para.instanceName] = coon;
            console.log('Connect to mongoDB success: '+para.instanceName);
        });
        coon.on('disconnected', function() {
            console.warn('Disconnect to mongoodb : '+para.instanceName);
        });
        coon.on('error', function(error) {
            console.error('Connect to mongoodb with error: '+error+' para: '+para.instanceName);
        });
    })
};

MongoServices.prototype.validateParams = function (mongoParas) {
    if(arguments.length > 1){
        console.warn('param error, connect mysql failed');
        return false;
    }
    if(!_isArray(arguments[0])){
        console.warn('param must be array, connect mysql failed');
        return false;
    }
    return true;
};

module.exports = new MongoServices();