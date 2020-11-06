class DAO {
  constructor(model) {
    this._model = model
  }

  // 创建
  create(obj) {
    let entity = new this._model(obj)
    return this._model.create(entity)
  }

  // 插入
  insert(obj) {
    if (Array.isArray(obj)) {
      return this._model.insertMany(obj)
    }
    let entity = new this._model(obj)
    return entity.save()
  }

  // 查询全部
  find(conditions, projection = null, options = null) {
    return this._model.find(conditions, projection, options)
  }

  // 查询单个
  findOne(conditions, projection = null, options = null) {
    return this._model.findOne(conditions, projection, options)
  }

  // 按_id查询
  findById(id, projection = null, options = null) {
    return this._model.findById(id, projection, options)
  }

  // 查询并分组
  findAndGroup(groupBy, conditions, sort, projection = null) {
    return new Promise((resolve, reject) => {
      if (projection) {
        let obj = { _id: '$_id' }
        projection.split(' ').forEach(item => {
          obj[item] = '$' + item
        })
        projection = obj
      } else {
        projection = '$$ROOT'
      }
      this._model.aggregate([
        { $match: conditions },
        { $group: { _id: '$' + groupBy, arr: { $push: projection } } },
        { $sort: sort }
      ]).then(result => {
        let arr = []
        result.forEach(item => {
          arr.push(item.arr)
        })
        resolve(arr)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // 按_id查询并更新，返回更新后文档
  findByIdAndUpdate(id, update, options = null) {
    options = Object.assign({ new: true }, options)
    return this._model.findByIdAndUpdate(id, update, options)
  }

  // 查询单个并更新，返回更新后文档
  findOneAndUpdate(conditions, update, options = null) {
    options = Object.assign({ new: true }, options)
    return this._model.findOneAndUpdate(conditions, update, options)
  }

  // 更新
  update(conditions, doc, options = null) {
    options = Object.assign({}, options)
    return this._model.updateMany(conditions, doc, options)
  }

  // 删除
  delete(conditions) {
    return this._model.remove(conditions)
  }
}

module.exports = DAO
