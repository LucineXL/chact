import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Menu,Icon ,Input ,Modal,Spin} from 'antd';
import {getGroup} from 'actions/user';
import Chact from './Chact'
import './style.scss'
const Search = Input.Search;
const SubMenu = Menu.SubMenu;

class Main extends Component {
    constructor(props){
        super(props);
        this.settingShow = this.settingShow.bind(this);
        this.changeTheme = this.changeTheme.bind(this);
        this.changeModal = this.changeModal.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
          showSetting: false,
          themeVisible:false,
          logoutVisible:false,
          groupVisible:false,
          theme:1
        };
    }
    componentWillMount() {
      const {app,auth,getGroup} = this.props;
      console.log(app)
      console.log(auth);
      if(auth.size && !app.size){
        getGroup(auth.get('username'));
      }
    }
    logout(){
      sessionStorage.removeItem('auth');
      this.changeModal.bind(this,'logoutVisible',false);
      location.reload();
    }
    settingShow(){
      const that = this;
      this.setState({
        showSetting:true
      })
      document.onclick = function () {
        that.setState({
          showSetting: false
        })
      }
    }
    changeTheme(val){
      this.setState({
        theme:val
      })
    }
    changeModal(key,val){
      console.log(123);
      this.setState({
        [key]:val
      })
    }
    render() {
      const { showSetting, theme, themeVisible,logoutVisible,groupVisible} = this.state;
      const { app } = this.props;
      if(!app.get('allGroup')){
        return false;
      }
      const allGroup = app.get('allGroup');
      const img = require('source/photo.jpg');
      return (
        <div className={`chart theme${theme}`}>
          <div className='aside'>
            <img src={img} className='photo' />
            <Icon type="usergroup-add" className='iconfont'/>
          </div>
          <div className='left'>
            <div className='left-title'>
              CHACT <Icon type="ellipsis" className='iconfont' onClick={this.settingShow} />
              {
                showSetting && <div className='setting'>
                  <div className='setItem'>
                    <Icon type="user-add" style={{ color: '#f1a52f' }} />添加好友
                  </div>
                  <div className='setItem' onClick={this.changeModal.bind(this,'groupVisible',true)}>
                    <Icon type="usergroup-add" style={{ color: '#5788d9' }} />创建群聊
                  </div>
                  <div className='setItem' onClick={this.changeModal.bind(this,'themeVisible',true)}>
                    <Icon type="skin" style={{ color: '#70cc29' }} />更换主题
                  </div>
                  <div className='setItem'>
                    <Icon type="setting" style={{ color: '#a645dc' }} />信息编辑
                  </div>
                  <div className='setItem' onClick={this.changeModal.bind(this,'logoutVisible',true)}>
                    <Icon type="export" style={{ color: '#ff435a' }}/>退出
                  </div>
                </div>
              }
            </div>
            <div className='search'>
              <Search placeholder="搜索群聊加入" style={{ width: 200 }} onSearch={value => console.log(value)} />
            </div>
            {
              allGroup.get('loading') ? <Spin /> :
              <div className='left-main'>
                {
                  allGroup.get('success') ?
                  <div className='list'>
                    <Menu className='friend-list' defaultOpenKeys={['group']}  mode="inline">
                      <SubMenu key="sub1" title={<span>我的好友</span>}>
                        <Menu.Item key="5" className='item'>
                            <img src={img} className='item-img' />
                            <p>admin</p>
                        </Menu.Item>
                        <Menu.Item key="6"  className='item'>
                            <img src={img} className='item-img' />
                            <p>admin</p>
                        </Menu.Item>
                      </SubMenu>
                      <SubMenu key="group" title={<span>我的群聊</span>}>
                        {allGroup.get('group').size &&
                          allGroup.get('group').map((value,index)=>{
                            return <Menu.Item key={`group${index}`} className='item'>{value.get('groupname')}</Menu.Item>
                          })
                        }
                      </SubMenu>
                    </Menu>
                  </div>
                  :<div className='error'>哎呀，出错了呢，请稍后重试  ^o^</div>
                }
              </div>
            }
          </div>
          <div className='center'>
            {this.props.children}
          </div>
          <Modal visible={themeVisible} width={455} closable footer={null} className='themeModal' maskClosable={false}
            onCancel={this.changeModal.bind(this, 'themeVisible',false)}>
            <p className='title'>主题</p>
            <div className='themeBox'>
              <span className={`themeItem${theme == 1 ? ' activeTheme' : ''}`} style={{ background: '#E3E7EF' }}
                onClick={this.changeTheme.bind(this, 1)}>清凉蓝</span>
              <span className={`themeItem${theme == 2 ? ' activeTheme' : ''}`} style={{ background: '#FFEFE9' }}
                onClick={this.changeTheme.bind(this, 2)}>护眼橙</span>
              <span className={`themeItem${theme == 3 ? ' activeTheme' : ''}`} style={{ background: '#E1D6E9' }}
                onClick={this.changeTheme.bind(this, 3)}>浪漫紫</span>
              <span className={`themeItem${theme == 4 ? ' activeTheme' : ''}`} style={{ background: '#D4E8D4' }}
                onClick={this.changeTheme.bind(this, 4)}>清新绿</span>
              <span className={`themeItem${theme == 5 ? ' activeTheme' : ''}`} style={{ background: '#4D6778' }}
                onClick={this.changeTheme.bind(this, 5)}>深沉绿</span>
              <span className={`themeItem${theme == 6 ? ' activeTheme' : ''}`} style={{ background: '#292A39' }}
                onClick={this.changeTheme.bind(this, 6)}>高调黑</span>
            </div>
          </Modal>
          <Modal visible={logoutVisible} width={400} closable className='logoutModal' maskClosable={false}
            onCancel={this.changeModal.bind(this,'logoutVisible',false)} onOk={this.logout}>
            您确定要退出吗？
          </Modal>
          <Modal visible={groupVisible} width={455} closable className='groupModal' maskClosable={false}
            onCancel={this.changeModal.bind(this,'groupVisible',false)} onOk={this.logout}>
            <div>
              <Input type='text' maxLength={20} />

            </div>
          </Modal>
        </div>
      );
    }
}
function mapStateToProps(state) {
  const auth = state.get('auth');
  const app = state.get('app');
  return {
    auth,
    app
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getGroup
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
