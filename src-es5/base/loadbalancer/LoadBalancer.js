/**
 * Created by shipengqi on 17-3-13.
 */
var grpcService = require('../GrpcService');
var Timer = require('./Timer');
var _isArray = require('lodash/isArray');
var _each = require('lodash/each');
var timer = new Timer();

function LoadBalancer() {
    this.channels = [];
    this.healthyChannel = [];
}

LoadBalancer.prototype.init = function (channels) {
    var self = this;
    if (!LoadBalancer.validateParams(channels)) {
        return;
    }

    _each(channels, function (channel) {
        var node = grpcService.createClient(channel);
        self.channels.push(node);
    });
    timer.run(self.channels);
};

LoadBalancer.prototype.close = function () {
    timer.stop();
    console.log('grpc channels state auto checker closed');
};

LoadBalancer.prototype.selectChannel = function (serviceName) {
    var self = this;
    var index;
    if(timer.healthyNode.length === 0){
        console.log('all channels status is not ok');
        return ;
    }
    _each(timer.healthyNode,function (channel) {
        if(channel.serviceName === serviceName){
            self.healthyChannel.push(channel);
        }
    });
    index = Math.floor(Math.random()*(self.healthyChannel.length-1));
    return self.healthyChannel[index].client;
};

LoadBalancer.validateParams = function (channels) {
    if(!_isArray(channels)){
        console.warn('param must be array, init failed');
        return false;
    }
    return true;
};

module.exports = new LoadBalancer;