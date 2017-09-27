/**
 * Created by shipengqi on 17-1-7.
 */

var Redis = require('ioredis');
var _isArray = require('lodash/isArray');

function RedisServices() {
    this.redisHds = {};
}

RedisServices.prototype.connectRedis = function (redisParas) {
    if(!this.validateParams(redisParas)){
        return;
    }
    var self = this;
    redisParas.forEach(function (i) {
        var redisPara = i;
        var redisHd = new Redis(redisPara.para);
        redisHd.on("connect", function(){
            self.redisHds[redisPara.instanceName] = redisHd;
            console.log('Connect to redis success , host: '+redisPara.instanceName);
        });
        redisHd.on("end", function(){
            console.warn('End connection to redis , host : '+redisPara.instanceName);
        });
        redisHd.on("error", function(err){
            console.error('onnect redis : '+redisPara.instanceName+' with error: '+err);
        });
    })
};

RedisServices.prototype.validateParams = function (redisParas) {
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


module.exports = new RedisServices();