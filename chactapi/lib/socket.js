const UserModel = require('./models/User');
const GroupModel = require('./models/Group');
const MessageModel = require('./models/Message');

let onlineUser = [];
let onlineCount = 0;

module.exports = function (socket) {
    console.log('链接成功');
    socket.on('login', function (req) {
        const index = onlineUser.findIndex(item=>item._id == socket.id);
        if(index == -1)
        {
            onlineUser.push({'user':req.username,'_id':socket.id});
            onlineCount += 1;
        }else{
            onlineUser[index]._id = socket.id;
        }
        console.log(onlineUser)
        socket.emit('onlineCount',onlineCount);
        socket.broadcast.emit('onlineCount',onlineCount);
        socket.broadcast.emit('systemInfo',`${req.username}上线了~`);
    });
    socket.on('disconnect', function () {
        const index = onlineUser.findIndex(item=>item._id == socket.id);
        if(index != -1){
            const username = onlineUser[index].user;
            socket.broadcast.emit('systemInfo',`${username}下线了~`);
            onlineUser.splice(index,1);
            onlineCount -= 1;
        }
        socket.emit('onlineCount',onlineCount);
        socket.broadcast.emit('onlineCount',onlineCount);
    });
    socket.on('sendMessage',async(req)=>{
        console.log(req)
        const {groupname,timestamp,user,type,content,to} = req;
        if(type == 1){
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
                    socket.broadcast.to(groupname).broadcast.emit('ComMessage', req);
                }catch (err){
                    console.log(err);
                }
            }
        }else{
            const index = onlineUser.findIndex(item =>item.user == to);
            if(index!==-1){
                const id = onlineUser[index]._id;
                console.log(id)
                socket.nsp.sockets[id].emit('SpeMessage',req)
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