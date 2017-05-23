const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // 解析body字段模块
const morgan = require('morgan'); //命令行log显示
const mongoose = require('mongoose');
const router = express.Router();
const routes = require('./routes'); //路由配置
const config = require('./config'); //全局配置
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mysocket = require('./socket');

let port = process.env.PORT || 8086;
//设置跨域访问

// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", 'http://localhost:8085');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header("X-Powered-By", ' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
    
//     next();
// });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // 调用bodyParser模块以便程序正确解析body传入值

app.use(morgan('dev')); // 命令行中显示程序运行日志,便于bug调试
app.use(express.static(path.resolve(__dirname, '../public/'))); // 静态文件

app.use('/api', router); //路由传入
routes(router,io);
io.on('connection', function (socket) {
    mysocket(socket);
})

mongoose.Promise = global.Promise;
mongoose.connect(config.database); //连接数据库

server.listen(port, () => {
    console.log('listening on port : ' + port);
});
