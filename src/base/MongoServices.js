/**
 * Created by shipengqi on 17-1-7.
 */
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

class MongoServices {

    constructor(){
        this.mongoHds = {};
        this.instance = null;
    }

    connectMongodb(mongoParas){
        if(!this.validateParams(mongoParas)){
            return;
        }
        let self = this;
        let options = {
            'db': {'readPreference': 'secondaryPreferred'}
        };
        for(let i of mongoParas){
            let para = i;
            let coon = mongoose.createConnection(para.uri, options);
            coon.on('connected', function() {
                self.mongoHds[para.instanceName] = coon;
                console.log(`Connect to mongoDB success: ${para.uri}`);
            });
            coon.on('disconnected', function() {
                console.warn(`Disconnect to mongoodb : ${para.uri}`);
            });
            coon.on('error', function(error) {
                console.error(`Connect to mongoodb with error: ${error} para: ${para.uri}`);
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
            instance = new MongoServices();
        }
        return instance;
    }
}

export default MongoServices.getInstance();