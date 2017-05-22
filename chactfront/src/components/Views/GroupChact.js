import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {changeToTimeMMDDHHMM} from 'utils/moment';
import {reqSendMessage , getUserInfo,createSpeChact,setActive} from 'actions/user';
import {Icon,Popover,Spin,Button} from 'antd';
import {push} from 'react-router-redux';
import socket from 'store/socket';

class GroupChact extends Component {
   constructor(props){
        super(props);
        this.textChange = this.textChange.bind(this);
        this.userInfo = this.userInfo.bind(this);
        this.createChact = this.createChact.bind(this);
    }
    componentDidMount(){
        this.refs.message.scrollTop =  this.refs.message.scrollHeight - this.refs.message.clientHeight;
    }
    componentWillReceiveProps(nextProps) {
        this.refs.message.scrollTop =  this.refs.message.scrollHeight - this.refs.message.clientHeight;
    }
    textChange(e){
        const {auth,activeIndex,activeKey,activeGroup,reqSendMessage} = this.props;
        let conf = '';
        if(activeKey=='group'){
            conf = {groupname:activeGroup.get('groupname')}
        }else{
            conf = {to:activeGroup.get('username')}
        }
        const message = {
            timestamp:new Date().getTime(),
            user:auth.get('uid'),
            type: activeKey=='group' ? 1 : 2,
            content:this.refs.textarea.value,
            user:{
                '_id':auth.get('uid'),
                'username':auth.get('username')
            }
        }
        if(e.keyCode == 13){
            reqSendMessage({
                gidx:activeIndex,
                message
            })
            this.refs.textarea.value = '';
            setTimeout(()=>{
                this.refs.message.scrollTop =  this.refs.message.scrollHeight - this.refs.message.clientHeight;
            },0)
            socket.emit('sendMessage',Object.assign(message,conf));
        }
    }
    userInfo(username){
        const { getUserInfo } = this.props;
        getUserInfo(username);
    }
    createChact(user){
        const {push,myChact, activeIndex,createSpeChact} = this.props;
        const index = myChact.findIndex(item=>item.get('_id')==user.get('_id'))
        if( index == -1){
            createSpeChact({'_id':user.get('_id'),'username':user.get('username')})
        }
        this.props.setActive({key:'chact',value:index==-1?0:index})
    }
    render() {
        const {userInfo,activeKey,activeGroup,activeIndex,auth,getUserInfo,onlineCount} = this.props;
        const uid = auth.get('uid');
        const message = activeGroup.get('message');
        const user = userInfo && userInfo.get('user') ? userInfo.get('user') : '';
        const content = userInfo ? <div className='card'>
            {userInfo.get('loading') ? <Spin />:<div className='cardInfo'>
                <p className='cardItem'>{user.get('username')} <Icon type={user.get('sex')=='男' ? 'man' : 'woman'}/></p>
                <p className='cardItem'>电话：{user.get('phone') ? user.get('phone') : '该用户暂未绑定'}</p>
                <p className='cardItem'>email：{user.get('email') ? user.get('email') : '该用户暂未绑定'}</p>
                {activeKey=='group' ?<Button onClick={this.createChact.bind(this,user)}>发消息</Button>:''}
            </div>}
        </div> : ''
        return (
            <div className='chactBox'>
                <header className='header'>{activeKey=='group'?activeGroup.get('groupname'):activeGroup.get('username')}</header>
                <div className='main'>
                    <p className='info'>当前在线人数 ： {onlineCount}</p>
                    <div className='message' ref='message'>
                        {
                            message.map((value,index)=>{
                                const username = value.getIn(['user','username']);
                                const id = value.getIn(['user','_id']);
                                return <div className={`messageItem ${uid== id?'mine':'other'}`} key={`message${index}`}>
                                    <Popover content={content} title='资料' trigger="click">
                                        <div className='photo' onClick={this.userInfo.bind(this,username)}>{username.slice(0,1)}</div>
                                    </Popover>
                                    <div className='main'>
                                        <div className='user'>
                                            <div className='name'>{username}</div>
                                            <div className='time'>{changeToTimeMMDDHHMM(value.get('timestamp'))}</div>
                                        </div>
                                        <div className='content'>{value.get('content')}</div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className='footer'>
                    <div className='conf'>
                        <Icon type="smile-o" />
                    </div>
                    <textarea className='textarea' autoFocus onKeyDown={this.textChange} ref='textarea'></textarea>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    const app = state.get('app');
    const auth = state.get('auth');
    const myChact = app.get('myChact');
    const onlineCount = app.get('onlineCount');
    const allGroup = app.getIn(['allGroup','group']);
    const activeKey = app.getIn(['activeItem','key']);
    const activeIndex = app.getIn(['activeItem','value']);
    const userInfo = app.get('userInfo');
    const activeGroup =  activeKey=='group' ? app.getIn(['allGroup','group',activeIndex]) : app.getIn(['myChact',activeIndex]);
    return { auth ,app ,myChact ,allGroup ,activeKey ,activeIndex ,userInfo,activeGroup,onlineCount}
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        push,
        setActive,
        reqSendMessage,
        getUserInfo,
        createSpeChact
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupChact)
