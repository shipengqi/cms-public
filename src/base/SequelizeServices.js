/**
 * Created by shipengqi on 17-1-9.
 * 统一主键，名称必须是id，类型必须是STRING(50)
 * 主键可以自己指定，也可以由框架自动生成（如果为null或undefined）
 * 所有字段默认为NOT NULL，除非显式指定
 * 统一timestamp机制，每个Model必须有createdAt、updatedAt和version，分别记录创建时间、修改时间和版本号。
 * 其中，createdAt和updatedAt以BIGINT存储时间戳，无需处理时区，排序方便。version每次修改时自增。
 */

import Sequelize from 'sequelize';
import uuid from 'uuid';
import {_isArray} from '../utils/utils';

const ID_TYPE = Sequelize.STRING(50);
const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

//@getInstance
class SequelizeServices {

    constructor() {
        this.sequelizeHds = {};
        this.instance = null;
    }

    initSequelize(mysqlParas) {
        if(!this.validateParams(mysqlParas)){
            return;
        }
        let self = this;
        for(let i of mysqlParas) {
            let mysqlPara = i;
            let sequelize = new Sequelize(mysqlPara.database, mysqlPara.username || null, mysqlPara.password || null, mysqlPara.para);
            let exp = {
                defineModel: function (name,attributes) {
                    let attrs = {};
                    for (let key in attributes) {
                        let value = attributes[key];
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
                        primaryKey: true
                    };
                    attrs.createdAt = {
                        type: Sequelize.BIGINT,
                        allowNull: false
                    };
                    attrs.updatedAt = {
                        type: Sequelize.BIGINT,
                        allowNull: false
                    };
                    attrs.version = {
                        type: Sequelize.BIGINT,
                        allowNull: false
                    };

                    return sequelize.define(name, attrs, {
                        tableName: name,
                        timestamps: false,
                        hooks: {
                            beforeValidate: function (obj) {
                                let now = Date.now();
                                if (obj.isNewRecord) {
                                    console.log('will create entity...' + obj);
                                    if (!obj.id) {
                                        obj.id = generateId();
                                    }
                                    obj.createdAt = now;
                                    obj.updatedAt = now;
                                    obj.version = 0;
                                } else {
                                    console.log('will update entity...');
                                    obj.updatedAt = now;
                                    obj.version++;
                                }
                            }
                        }
                    });
                }
            };

            for (let type of TYPES) {
                exp[type] = Sequelize[type];
            }

            self.sequelizeHds[mysqlPara.instanceName] = exp;
            console.log(`Connect to mysql success: ${mysqlPara.instanceName}`);
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
            instance = new SequelizeServices();
        }
        return instance;
    }
}

function generateId() {
    return uuid.v1();
}

export default SequelizeServices.getInstance();