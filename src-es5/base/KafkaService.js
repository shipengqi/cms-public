/**
 * Created by shipengqi on 17-2-23.
 */
var _isArray = require('lodash/isArray');
var _extend = require('extend');
var kafka = require('kafka-node'),
    Client = kafka.Client,
    Producer = kafka.Producer,
    Consumer = kafka.Consumer,
    Offset = kafka.Offset,
    KeyedMessage = kafka.KeyedMessage;


function kafkaService() {
    this.producer = null;
    this.producerOptions = {
        partitionerType: 2
    };
    this.consumerOptions = {
        fromOffset: false
    };
}

kafkaService.prototype.createProducer = function (params) {
    var self = this;
    let options = self.producerOptions;
    if(params.options){
        options = _extend(true,self.producerOptions,params.options);
    }
    var client = new Client(params.address);
    var producer = new Producer(client,options);

    producer.on('ready', function () {
        console.log(' producer ready for service : %s',params.address);
        self.producer = producer;
    });

    producer.on('error', function (err) {
        console.error(' producer ready for service error : ',err);
    })
};

kafkaService.prototype.createConsumer = function (params,callback) {
    var self = this;
    var client = new Client(params.address);
    //var offset = new Offset(client);
    let options = self.consumerOptions;
    if(params.options){
        options = _extend(true,self.consumerOptions,params.options);
    }
    var consumer = new Consumer(client, params.topics, options);

    console.log(' consumer ready for service : %s',params.address);
    consumer.on('message', function(message) {
        callback(null,message);
    });

    consumer.on('error', function(err) {
        console.log('consumer for service error : ', err);
        callback(err);
    });

    consumer.on('offsetOutOfRange', function(err) {
        console.log('consumer offset OutOf Range : ', err);
        // offset.fetchLatestOffsets(params.topics.map(function (item) {
        //     return item.topic;
        // }),function (error,offets) {
        //     if (error){
        //         console.error(error);
        //         return;
        //     }
        //
        //     params.topics.forEach(function (t) {
        //         consumer.setOffset(t.topic,t.partition,offets[t.topic][t.partition])
        //     })
        // })
        callback(err);
    });
};

kafkaService.prototype.sendMsg = function (payloads,callback) {
    if(!(_isArray(payloads))){
        throw new Error('parameter error');
    }

    this.producer.send(payloads, function (err, data) {
        callback(err,data);
    });
};

module.exports = new kafkaService();