import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Icon} from 'antd';
import socket from 'store/socket';

class Chact extends Component {
   constructor(props){
        super(props);
        this.textChange = this.textChange.bind(this);
    }
    textChange(e){
        const {auth,activeGroup} = this.props;
        const message = {
            groupname:activeGroup.get('groupname'),
            timestamp:new Date().getTime(),
            user:auth.get('uid'),
            type:1,
            content:this.refs.textarea.value
        }
        if(e.keyCode == 13){
            socket.emit('sendMessage',message);
        }
    }
    render() {
        const {activeGroup} = this.props;
        return (
            <div className='chactBox'>
                <header className='header'>{activeGroup.get('groupname')}</header>
                <div className='main'>
                    <p className='info'>本群聊当前在线人数 ： 10</p>
                    <div className='message'></div>
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
    const activeIndex = app.get('activeGroup');
    const activeGroup = app.getIn(['allGroup','group',activeIndex]);
    return { auth ,app ,activeIndex ,activeGroup }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Chact)
