/**
 * Created by shipengqi on 17-1-9.
 * 统一主键，名称必须是id，类型必须是STRING(50)
 * 主键可以自己指定，也可以由框架自动生成（如果为null或undefined）
 * 所有字段默认为NOT NULL，除非显式指定
 * 统一timestamp机制，每个Model必须有createdAt、updatedAt和version，分别记录创建时间、修改时间和版本号。
 * 其中，createdAt和updatedAt以BIGINT存储时间戳，无需处理时区，排序方便。version每次修改时自增。
 */

var Sequelize = require('sequelize');
var uuid = require('uuid');
var _isArray = require('lodash/isArray');
var _isObject = require('lodash/isObject');

var ID_TYPE = Sequelize.BIGINT(20);
var TYPES = [
    'STRING',
    'CHAR',
    'INTEGER',
    'BIGINT',
    'TEXT',
    'DOUBLE',
    'DATEONLY',
    'BOOLEAN',
    'DATE',
    'FLOAT',
    'NOW',
    'BLOB',
    'DECIMAL',
    'UUID',
    'UUIDV1',
    'UUIDV4',
    'HSTORE',
    'VIRTUAL',
    'ENUM',
    'ARRAY()'
];

function SequelizeServices() {
    this.sequelizeHds = {};
}

SequelizeServices.prototype.initSequelize = function (mysqlParas) {
    if(!this.validateParams(mysqlParas)){
        return;
    }
    var self = this;
    mysqlParas.forEach(function (i) {
        var mysqlPara = i;
        var sequelize = new Sequelize(mysqlPara.database, mysqlPara.username || null, mysqlPara.password || null, mysqlPara.para);
        var exp = {
            defineModel: function () {
                var name;
                var tableName;
                var attributes;
                switch(arguments.length){
                    case 2:
                        name = arguments[0];
                        tableName = arguments[0];
                        attributes = arguments[1];
                        break;
                    case 3:
                        name = arguments[0];
                        tableName = arguments[1];
                        attributes = arguments[2];
                        break;
                    default:
                        throw new Error('unsupport params');
                        break;
                }

                var attrs = {};
                for (var key in attributes) {
                    var value = attributes[key];
                    if (typeof value === 'object' && value['type']) {
                        value.allowNull = value.allowNull || false;
                        attrs[key] = value;
                    } else {
                        attrs[key] = {
                            type: value,
                            allowNull: false
                        };
                    }
                }

                attrs.id = {
                    type: ID_TYPE,
                    primaryKey: true,
                    autoIncrement:true,
                    allowNull:false
                };
                attrs.create_time = {
                    type: Sequelize.DATE,
                    allowNull: true
                };
                attrs.update_time = {
                    type: Sequelize.DATE,
                    allowNull: true
                };
                attrs.is_delete = {
                    type:Sequelize.INTEGER(4),
                    defaultValue:0,
                    allowNull:true
                };

                return sequelize.define(name, attrs, {
                    tableName: tableName,
                    freezeTableName:true,
                    timestamps:false
                });
            },
            define:function(name, attributes,options){
                return sequelize.define(name, attributes || {},options || {});
            }
        };

        TYPES.forEach(function (type) {
            if(Sequelize[type]){
                exp[type] = Sequelize[type];
            }
        });

        self.sequelizeHds[mysqlPara.instanceName] = exp;

        console.log('Connect to mysql success: '+mysqlPara.instanceName);
    })
};

SequelizeServices.prototype.validateParams = function (mysqlParas) {
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


function generateId() {
    return uuid.v1();
}

module.exports = new SequelizeServices();