import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import {Button,message,Input,Radio,DatePicker} from 'antd';
import moment from 'moment';
import { requestUpdate } from 'actions/auth';
const RadioGroup = Radio.Group;

class Information extends Component {
    constructor(props){
        super(props);
        this.state = {
            birthday:props.auth.get('birthday'),
            sex:props.auth.get('sex'),
            error:false
        }
        this.save = this.save.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    save(){
        const {sex,birthday} = this.state;
        const {requestUpdate,auth,push} = this.props;
        const email = this.refs.email.refs.input.value;
        const address = this.refs.address.refs.input.value;
        if (email && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            this.setState({
                error: true
            });
            return false;
        }
        const query = {
            _id:auth.get('_id'),
            username:auth.get('username'),
            sex,
            birthday,
            email,
            address
        }
        requestUpdate(query).then(()=>{
            message.success('保存成功');
            sessionStorage.setItem('auth', JSON.stringify(query));
            // storageAuth(query);
            push('/');
        }).catch(()=>{
            message.error('保存失败')
        })
    }
    handleKeyDown(e) {
        if (e.key === ' ') {
            e.preventDefault();
        }
    }
    render() {
        const {error} = this.state;
        const {auth} = this.props;
        return (
            <div className='information'>
                <header className='header'>个人信息修改</header>
                <div className='main'>
                    <div className='formInfo'>
                        <label>用户名</label>
                        <div className='formInfoR'>{auth.get('username')}</div>
                    </div>
                    <div className='formInfo'>
                        <label>性别</label>
                        <div className='formInfoR'>
                            <RadioGroup  defaultValue={auth.get('sex')} 
                                onChange={(e) => { this.setState({ sex: e.target.value }) }}>
                                <Radio value='男'>男</Radio>
                                <Radio value='女'>女</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div className='formInfo'>
                        <label>出生日期</label>
                        <div className='formInfoR'>
                            <DatePicker onChange={(date) => { this.setState({ birthday: date.format('YYYY-MM-DD') }) }}
                                allowClear={false} disabledDate={this.disabledDate} format='YYYY-MM-DD' 
                                defaultValue={moment(auth.get('birthday'), 'YYYY-MM-DD')}/>
                        </div>
                    </div>
                    <div className='formInfo'>
                        <label>邮箱</label>
                        <div className={`formInfoR`}>
                            <Input type="email" placeholder="Email" ref="email" className='formInput'
                                defaultValue={auth.get('email')} onKeyDown={this.handleKeyDown}/>
                        </div>
                    </div>
                    {error ? <p className='errorP'>'邮箱格式不正确'</p> : ''}
                    <div className='formInfo'>
                        <label>地址</label>
                        <div className='formInfoR'>
                            <Input type="text" placeholder="Address" ref="address" className='formInput'
                               defaultValue={auth.get('address')}/>
                        </div>
                    </div>
                </div>
                <Button type="primary" onClick={this.save} loading={auth.get('loading')?auth.get('loading'):false}>
                  保存
                </Button>
            </div>
        );
    }
}
function mapStateToProps(state) {
    const auth = state.get('auth');
    return {
        auth
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        push,
        requestUpdate
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Information)
