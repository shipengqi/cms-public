/**
 * Created by shipengqi on 17-1-7.
 */

var MongoServices  = require('./src-es5/base/MongoServices');
var RedisServices =  require('./src-es5/base/RedisServices');
var SequelizeServices = require('./src-es5/base/SequelizeServices');
var OssService = require('./src-es5/base/OssService');
var GrpcService = require('./src-es5/base/GrpcService');
var KafkaService = require('./src-es5/base/KafkaService');
var LoadBalancer = require('./src-es5/base/loadbalancer/LoadBalancer');

module.exports = {
    MongoServices:MongoServices,
    RedisServices:RedisServices,
    SequelizeServices:SequelizeServices,
    OssService:OssService,
    GrpcService:GrpcService,
    KafkaService:KafkaService,
    RpcLoadBalancer:LoadBalancer
};