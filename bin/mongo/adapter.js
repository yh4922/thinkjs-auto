/**
 * mongoose adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mongoose',
  mongoose: {
    handle: require('think-mongoose'), 
    host: '主机地址',
    user: '登录名',
    password: '登录密码',
    database: '数据库名',
    useCollectionPlural: false,
    options: {}
  }
}