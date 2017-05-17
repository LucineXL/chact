import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {changeToTimeMMDDHHMM} from 'utils/moment';
import {reqSendMessage} from 'actions/user';
import {Icon} from 'antd';
import socket from 'store/socket';

class Chact extends Component {
   constructor(props){
        super(props);
        this.textChange = this.textChange.bind(this);
    }
    componentDidMount(){
        this.refs.message.scrollTop = this.refs.message.scrollHeight -this.refs.message.clientHeight;
    }
    textChange(e){
        const {auth,activeIndex,activeGroup,reqSendMessage} = this.props;
        const message = {
            timestamp:new Date().getTime(),
            user:auth.get('uid'),
            type:1,
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
                this.refs.message.scrollTop =  this.refs.message.scrollHeight -this.refs.message.clientHeight;
            socket.emit('sendMessage',Object.assign(message,{groupname:activeGroup.get('groupname')}));
            
        }
    }
    render() {
        const {activeGroup,auth} = this.props;
        const uid = auth.get('uid');
        const message = activeGroup.get('message');
        return (
            <div className='chactBox'>
                <header className='header'>{activeGroup.get('groupname')}</header>
                <div className='main'>
                    <p className='info'>本群聊当前在线人数 ： 10</p>
                    <div className='message' ref='message'>
                        {
                            message.map((value,index)=>{
                                const username = value.getIn(['user','username']);
                                const id = value.getIn(['user','_id']);
                                return <div className={`messageItem ${uid== id?'mine':'other'}`} key={`message${index}`}>
                                    <div className='photo'>{username.slice(0,1)}</div>
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
    const allGroup = app.getIn(['allGroup','group']);
    const activeIndex = app.get('activeGroup');
    const activeGroup = app.getIn(['allGroup','group',activeIndex]);
    return { auth ,app ,allGroup ,activeIndex ,activeGroup }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        reqSendMessage
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Chact)
