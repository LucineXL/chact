const UserModel = require('./models/User');
const GroupModel = require('./models/Group');
const MessageModel = require('./models/Message');

module.exports = function (socket) {
    console.log('链接成功');
    socket.on('login', function () {
        console.log('登录成功');
        socket.emit('message','user login');
    });
    socket.on('disconnect', function () {
        console.log('链接断开');
        socket.emit('message','user disconnected');
    });
    socket.on('sendMessage',async(req)=>{
        const {groupname,timestamp,user,type,content} = req;
        const group = await GroupModel.getGroup(groupname);
        if(group){
            var newMessage = new MessageModel({
                timestamp,
                user,
                type,
                content
            });
            try{
                group.messages.push(newMessage);
                group.save();
                newMessage.save();
                socket.broadcast.to(groupname).emit('message', req);
            }catch (err){
                console.log(err);
            }
        }
    })
    socket.on('joinGroup',async(req)=>{
        const {username,groups} = req;
        groups.map((value,index)=>{
            socket.join(value.groupname);
            socket.emit('systemInfo',`${username}加入群聊${value.groupname}`);
        })
    })
}