import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import {Button,message} from 'antd';
import { getGroup , createGroup } from 'actions/user';

class JoinGroup extends Component {
    constructor(props){
        super(props);
        this.joinGroup = this.joinGroup.bind(this);
    }
    joinGroup(){
        const {push,username,groupByName,getGroup,createGroup} = this.props;
        createGroup({
            action:2,
            username,
            _id:groupByName.get('_id')
        }).then(()=>{
            message.success('加入群聊成功')
            push('/');
            getGroup(username);
        }).catch(result=>{
            message.error(result.message)
        })
    }
    render() {
        const {groupByName} = this.props;
        const groupname = groupByName.get('groupname');
        return (
            <div className='group'>
                <header className='header'>
                    {groupname}
                </header>
                <Button icon="plus" onClick={this.joinGroup}>
                  加入群聊
                </Button>
            </div>
        );
    }
}
function mapStateToProps(state) {
    const groupByName = state.getIn(['app','groupByName']);
    const username = state.getIn(['auth','username']);
    return {
        username,
        groupByName
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        push,
        getGroup,
        createGroup
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinGroup)
