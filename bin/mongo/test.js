const { Schema } = require('mongoose');
const Common = require('./common')

module.exports = class extends think.Mongoose {
  get schema() {
    var _schema = new Schema({
      /** 数据模型字段 */
      ...Common.field
    })
    
    _schema.pre('save',  Common.handleSave);
    _schema.pre('update', Common.handleUpdate);
    _schema.pre('updateOne', Common.handleUpdate);

    // _schema.index({create_at: 1}); // 创建索引
    // _schema.index({is_delete: 1, update_at: -1}); // 组合索引
    return _schema;
  }
  async add (data) {return await Common.add.call(this, data)} 
  async del (id) {return await Common.del.call(this, id)} 
  async edit (data) {return await Common.edit.call(this, data)} 
  async getList (json, page, size, sort) {return await Common.getList.call(this, json, page, size, sort)} 
}