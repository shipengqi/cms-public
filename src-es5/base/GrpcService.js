/**
 * Created by shipengqi on 17-1-10.
 */
var grpc = require('grpc');
var contants = require('../contants/contants');
var ip = contants.LOCALHOST_DEFAULT_IP;
var DEFAULT_PORT = contants.DEFAULT_PORT;

function grpcService() {
    this.client = {};
}

grpcService.prototype.initServiceApi = function (params) {
    process.nextTick(function () {
        var proto = grpc.load(params.PROTO_PATH);
        var server = new grpc.Server();
        var port = params.port || DEFAULT_PORT;

        server.addProtoService(proto[params.serviceName].service, params.interface);
        server.bind(ip+port, grpc.ServerCredentials.createInsecure());
        server.start();
        console.log('grpc server start port: '+port);
    })
};

grpcService.prototype.createClient = function (params) {
    var proto = grpc.load(params.PROTO_PATH);
    var client = new proto[params.serviceName](params.ip,
        grpc.credentials.createInsecure());
    this.client[params.serviceName] = client;
    console.log('grpc client connect ip: '+params.ip);
    return {client:client,serviceName:params.serviceName};
};

module.exports = new grpcService();