# cms-public



benditoutiao cms public module：

[![NPM](https://nodei.co/npm/cms-public.png?downloads=true)](https://nodei.co/npm/cms-public/)


## Installation

>npm install cms-public

## Usage



[TOC]



### MongoServices

#### 连接mongodb

``` javascript
MongoServices.connectMongodb(MongoServiceParas);
```

**Arguments**
- MongoServiceParas      **Array**

#### 使用

``` javascript
const hd = MongoServices.mongoHds[instanceName];
let news = hd.model(collectionName, NewsSchema)；
```

### RedisServices:


#### 连接redis

``` javascript
RedisServices.connectRedis(redisServiceParas);
```

**Arguments**

- redisServiceParas      **Array**

#### 使用
``` javascript
const redisClient = RedisServices.redisHds[instanceName];
redisClient.set(redisKey,JSON.stringify(cacheData));
redisClient.set(redisKey,JSON.stringify(cacheData),'EX',expire);
redisClient.get(redisKey,function(err,result){
    if (err) {
        monitor.error(`redisClient get data error`);
    }
});
redisClient.del(redisKey,function(err){
    if (err) {
        monitor.error(`redisClient del error`);

    }else{
        resolve(`redisClient del success , key : ${redisKey}`);
    }
})
```



### SequelizeServices

#### 连接Mysql

``` javascript
SequelizeServices.initSequelize(sequelizeServiceParas);
```

**Arguments**

- sequelizeServiceParas      **Array**

#### 定义model

``` javascript
const db = SequelizeServices.sequelizeHds.source;
const Bbs = db.defineModel('bbs','bbs_subscribe_nexus', {
    bbs_id:db.BIGINT(20),
    site_id:{
        type:db.INTEGER(11),
        allowNull:false
    }
});
```
或

``` javascript
const Bbs = db.define('bbs_subscribe_nexus', {
    bbs_id:db.BIGINT(20),
    site_id:{
        type:db.INTEGER(11),
        allowNull:false
    }
});
```
#### 使用model

``` javascript
Bbs.localNewsSortModel.findAll({
        where:{
            news_id:id,
            is_delete:0
        }
    });
```

### OssService


**连接OSS**

``` javascript
OssService.initOSSClient(ossServerPara);
```

**Arguments**

- ossServerPara      **Object**

### GrpcService

#### 连接 Grpc Server

``` javascript
GrpcService.initServiceApi({
    PROTO_PATH:PROTO_PATH,
    port:argument.rpcPort,
    serviceName:'getNews',
    interface:require('./proto/newsGrpcInterface')
});
```

**Arguments**

- PROTO_PATH     proto文件路径
- port           rpc服务端口
- serviceName    proto 定义的服务名
- interface      rpc 服务的接口
#### 调用方法

``` javascript
GrpcService.client['getNews'].getAllShowType()
```

### KafkaService

#### 创建kafka消费者

``` javascript
KafkaService.createConsumer({address:'localhost:2181',topics:[{
    topic: 'cms',
    partition:0
}]},callback);
```

**Arguments**

- address    kafka服务ip , port
- topics     **Array**  消费者订阅 topic partition

#### 创建生产者

``` javascript
KafkaService.createProducer({address:'127.0.0.1:2181'});
```

#### 发布消息

``` javascript
KafkaService.sendMsg([{
    topic: 'cms',
    messages: JSON.stringify({operation:'onlineStatusSync',data:{
        online_news_id:74277294,
        status:0
    }})
}], function(err, result) {
    console.log(err || result);
});
```   

### LoadBalancer

#### Grpc负载均衡
``` javascript
 RpcLoadBalancer.init([{
    ip:'0.0.0.0:50051',
    PROTO_PATH:PROTO_PATH,
    serviceName:'getNews'
}]);
```    
#### 调用方法

``` javascript
RpcLoadBalancer.selectChannel('getNews').getOnlineData()
```

