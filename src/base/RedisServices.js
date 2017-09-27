/**
 * Created by shipengqi on 17-1-7.
 */

import Redis from 'ioredis';

class RedisServices {

    constructor(){
        this.redisHds = {};
        this.instance = null;
    }

    connectRedis(redisParas){
        if(!this.validateParams(redisParas)){
            return;
        }
        let self = this;
        for(let i of redisParas){
            let redisPara = i;
            let redisHd = new Redis(redisPara.para);
            redisHd.on("connect", function(){
                self.redisHds[redisPara.instanceName] = redisHd;
                console.log(`Connect to redis success , host: ${redisPara.para.host}`);
            });
            redisHd.on("end", function(){
                console.warn(`End connection to redis , host : ${redisPara.para.host}`);
            });
            redisHd.on("error", function(err){
                console.error(`onnect redis : ${redisPara.para.host} with error: ${err}`);
            });
        }

    }

    validateParams() {
        if(arguments.length > 1){
            console.warn('param error, connect mysql failed');
            return false;
        }
        if(!_isArray(arguments[0])){
            console.warn('param must be array, connect mysql failed');
            return false;
        }
        return true;
    }

    static getInstance () {
        let instance = this.instance;
        if (!instance) {
            instance = new RedisServices();
        }
        return instance;
    }
}

export default RedisServices.getInstance();