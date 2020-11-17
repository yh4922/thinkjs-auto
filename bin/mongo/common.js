/*
 * @Author: Yohann
 * @Description: 数据库的公共配置
 */
const {Schema, Types} = require('mongoose');

module.exports = {
  field: {
    create_at: {type: Number, default: Date.now}, // 记录创建时间
    update_at: {type: Number, default: 0}, // 记录更新时间
    remove_at: {type: Number, default: 0}, // 记录删除时间
    is_delete: {type: Number, default: 0}, // 记录是否已删除
    remark: {type: String, default: ''}, // 备注信息，作为备用
    reserve: {type: Object, default: {}}, // 备注信息，作为备用
  },
  /**
   * @description: 记录保存前的操作
   * @param {Function} next 继续执行方法
   */
  handleSave: function (next) {
    this.create_at = Date.now()
    next();
  },
  /**
   * @description: 记录跟前的操作
   * @param {Function} next 继续执行方法
   */
  handleUpdate: function (next) {
    this._update.update_at = Date.now()
    next();
  },
  /**
   * 添加数据
   * @param {*} data 添加的数据
   */
  async add (data) {
    let doc = new this(data)
    let _doc = await doc.save()
    return _doc
  },
  /**
   * 删除(标记删除)
   * @param {*} id 删除数据的ID
   */
  async del (id) {
    let _id = Types.ObjectId(id)
    await this.update({_id}, {
      is_delete: 1,
      remove_at: Date.now()
    })
  },
  /**
   * 修改数据
   * @param {Object} data 新的数据
   */
  async edit (data) {
    let _id = Types.ObjectId(data._id)
    await this.update({_id}, data)
  },
  /**
   * 获取列表数据
   * @param {*} json 查询条件 默认所有未删除的
   * @param {*} page 页码默认第一页
   * @param {*} size 分页大小默认15
   * @param {*} sort 排序条件 默认按添加时间降序
   */
  async getList (json = {}, page = 1, size = 15, sort = {_id: -1}, del = 0) {
    if (!del) {
      json.is_delete = 0
    }
    var list = await this.find(json).sort(sort).skip((page-1) * size).limit(size)
    let count = await this.find(json).count()

    return {
      json,
      list,
      page: { page, size, count}
    }
  }
}