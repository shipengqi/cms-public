/**
 * Created by shipengqi on 17-3-13.
 */
var async = require('async');
var _each = require('lodash/each');

function Timer() {
    this.timerInterval = 1000 * 5;
    this.intervalId = null;
    this.healthyNode = [];
}

Timer.prototype.run = function (nodes) {
    var self = this;
    self.check(nodes);
    setInterval(function () {
        self.check(nodes);
    }, self.timerInterval);
};

Timer.prototype.check = function (nodes) {
    var self = this;
    var health = [];
    async.map(nodes,function (node,callback) {
        node.client.checkStatus({}, function(err, response) {
            if(err){
                console.warn(err);
                callback(null,{node:node,status:false});
                return;
            }
            if(response.code && response.code === 1){
                callback(null,{node:node,status:true})
            }
        });
    },function (err,results) {

        _each(results,function (item) {
            if(item.status){
                health.push(item.node);
            }
        });

        self.healthyNode =  health;
    });


};

Timer.prototype.stop = function () {
    var self = this;
    clearInterval(self.intervalId);
};

module.exports = Timer;
