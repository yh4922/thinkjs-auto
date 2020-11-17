#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const child_process = require('child_process');

let runType = process.argv.slice(2)[0]

// 添加mongoose支持
if (runType === 'mongo') {
  // 先安装 think-mongoose 依赖
  console.log('正在安装[think-mongoose]依赖')
  child_process.exec('yarn add think-mongoose', {
    cwd: path.join(process.cwd())
  }, function (err, stdout, stderr) {
    if(err) {
      console.log('安装报错', err);
      return;
    }
    console.log(`${stdout}`);
    
    // 合成adapter文件路径
    let adapterPath = path.join(process.cwd(), 'src/config/adapter.js')
    // 获取adapter文件内容
    let adapterContext = fs.readFileSync(adapterPath)
    // 添加mongoose配置信息
    let adapterTmp = fs.readFileSync(path.join(__dirname, 'mongo', 'adapter.js'))
    adapterContext += '\n\r\n\r' + adapterTmp.toString()
    // 更新adapter文件内容
    fs.writeFileSync(adapterPath, adapterContext)

    // 合成extend文件路径
    let extendPath = path.join(process.cwd(), 'src/config/extend.js')
    // 获取extend文件内容
    let extendContext = fs.readFileSync(extendPath)
    extendContext = extendContext.toString()
    // 分割extend扩展文件
    let extendSplitTxt = ''
    if (extendContext.indexOf('module.exports = [') !== -1) extendSplitTxt = 'module.exports = ['
    else if (extendContext.indexOf('module.exports=[') !== -1) extendSplitTxt = 'module.exports=['
    else if (extendContext.indexOf('module.exports =[') !== -1) extendSplitTxt = 'module.exports =['
    else if (extendContext.indexOf('module.exports= [') !== -1) extendSplitTxt = 'module.exports= ['
    else extendSplitTxt = 'module.exports = ['
    let extendContextArr = extendContext.split(extendSplitTxt)
    // 添加extend信息
    extendContextArr[0] += "const mongoose = require('think-mongoose');\n\n" + extendSplitTxt + '\n  mongoose(think.app),'
    extendContext = extendContextArr.join('')
    // 更新extend文件内容
    fs.writeFileSync(extendPath, extendContext)

    // 创建mongo模型文件夹
    let mongoFolder = path.join(process.cwd(), 'src/model/mongo')
    if (!fs.existsSync(mongoFolder)) fs.mkdirSync(mongoFolder)
    // 创建common.js文件
    let commonJsPath = path.join(__dirname, 'mongo', 'common.js')
    fs.copyFileSync(commonJsPath, path.join(process.cwd(), 'src/model/mongo/common.js'))

    // 创建测试模板文件
    let testJsPath = path.join(__dirname, 'mongo', 'test.js')
    fs.copyFileSync(testJsPath, path.join(process.cwd(), 'src/model/mongo/test.js'))

    // 配置完成
    console.log('配置完成')
  })
}