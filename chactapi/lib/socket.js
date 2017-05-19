const UserModel = require('./models/User');
const GroupModel = require('./models/Group');
const MessageModel = require('./models/Message');

module.exports = function (socket) {
    console.log('链接成功');
    socket.on('login', function (req) {
        console.log('登录成功');
        socket.broadcast.emit('systemInfo',`${req.username}上线了~`);
    });
    socket.on('disconnect', function () {
        console.log('链接断开');
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
                if(type == 1){
                    group.messages.push(newMessage);
                    group.save();
                    newMessage.save();
                    socket.broadcast.to(groupname).emit('message', req);
                }else{

                }
                
            }catch (err){
                console.log(err);
            }
        }
    })
    socket.on('joinGroup',async(req)=>{
        const {username,groups} = req;
        groups.map((value,index)=>{
            socket.join(value.groupname);
           // socket.emit('systemInfo',`${username}加入群聊${value.groupname}`);
        })
    })
}