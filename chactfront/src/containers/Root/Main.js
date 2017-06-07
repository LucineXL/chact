import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {push} from 'react-router-redux';
import socket from 'store/socket';
import {
  Menu,
  Icon,
  Input,
  Modal,
  Spin,
  Button,
  message,
  Badge
} from 'antd';
import {
  getGroup,
  createGroup, 
  getGroupByName,
  setActive,
  reqSendMessage,
  setMessageNum,
  setDeleteGroup,
  createSpeChact,
  setOnlineCount
} from 'actions/user';
import JoinGroup from 'components/Views/JoinGroup';
import './style.scss'
const Search = Input.Search;
const SubMenu = Menu.SubMenu;

class Main extends Component {
    constructor(props){
    super(props);
    this.settingShow = this.settingShow.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.changeModal = this.changeModal.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.searchGroup = this.searchGroup.bind(this);
    this.showCreate = this.showCreate.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.logout = this.logout.bind(this);
    this.getGroupIndex = this.getGroupIndex.bind(this);
    this.state = {
      deleteVisible:false,
      showSetting: false,
      themeVisible: false,
      logoutVisible: false,
      groupVisible: false,
      createError: '',
      theme: 1
    };
  }
  componentWillMount() {
    const {app, auth,allGroup, getGroup} = this.props;
    if (auth.size && !app.size) {
      socket.emit('login',{'username':auth.get('username')});
      getGroup(auth.get('username')).then((result)=>{
        socket.emit('joinGroup',{
          groups:result.group,
          username:auth.get('username')
        })
      });
    }
  }
  componentDidMount(){
    socket.on('ComMessage', (message) => {
      this.getGroupIndex(message);
    })
    socket.on('SpeMessage', (message) => {
      this.getGroupIndex(message);
    })
    socket.on('systemInfo', (systemInfo) => {
      message.info(systemInfo);
    })
    socket.on('onlineCount',(count)=>{
      this.props.setOnlineCount(count)
    })
  }
  getGroupIndex(message){
    const {app, auth,activeItem,allGroup,myChact,reqSendMessage,setMessageNum} = this.props;
    const {content,groupname,timestamp,type,user} = message;
    if(!allGroup){
      return false;
    }
    let gidx,noRead;
    if(type == 1){
      gidx = allGroup.findIndex(item=>item.get('groupname')== groupname);
      noRead = allGroup.getIn([gidx,'noRead']) ? allGroup.getIn([gidx,'noRead']) : 0;
    }else{
      gidx = myChact.findIndex(item=>item.get('username') == user.username);
      noRead = myChact.size &&myChact.getIn([gidx,'noRead']) ? myChact.getIn([gidx,'noRead']) : 0;
    }
    reqSendMessage({
      gidx,
      message:{
        content,timestamp,type,user
      }
    })
    if(type==1){
      if( !(activeItem && activeItem.get('key') == 'group' && activeItem.get('value') == gidx)){
        setMessageNum({
          type,
          gidx,
          count: parseInt(noRead)+1
        })
      }
    }else{
      if( !(activeItem && activeItem.get('key') == 'chact' && activeItem.get('value') == gidx)){
        setMessageNum({
          type,
          gidx,
          count: parseInt(noRead)+1
        })
      }
    }
  }
  logout(){
    sessionStorage.removeItem('auth');
    this.changeModal.bind(this,'logoutVisible',false);
    location.reload();
  }
  deleteGroup(){
    const {getGroup,setDeleteGroup,activeItem,allGroup,auth,push} = this.props;
    const username = auth.get('username');
    this.changeModal('deleteVisible',false);
    setDeleteGroup({
      username:username,
      groupId:allGroup.getIn([activeItem.get('value'),'_id'])
    }).then(()=>{
      push('/');
      getGroup(auth.get('username'));
    }).catch((result)=>{
      message.error(result.message);
    })
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
  changeModal(key, val) {
    this.setState({[key]: val})
  }
  showCreate() {
    this.setState({
      createError: ''
    }, () => {
      if (this.refs.groupname) {
        this.refs.groupname.refs.input.value = '';
      }
      this.changeModal('groupVisible', true);
    })
  }
  createGroup() {
    const {auth, createGroup, getGroup,push} = this.props;
    const username = auth.get('username');
    this.createError = '';
    this.setState({
      createError: ''
    }, () => {
      createGroup({action: 1, username, groupname: this.refs.groupname.refs.input.value}).then(() => {
        this.changeModal('groupVisible', false);
        push('/');
        getGroup(username);
      }).catch(result => {
        if (result.success_id == 1002) {
          this.setState({createError: result.message})
        } else {
          this.changeModal('groupVisible', false);
          message.error('创建失败，请稍后重试')
        }
      })
    })
  }
  clickGroup(push,item) {
    const {allGroup,myChact, setActive, setMessageNum } = this.props;
    const gidx = parseInt(item.key.slice(5));
    setActive({'key':item.key.slice(0,5),'value':gidx});
    if(item.key.slice(0,5) == 'group'){
      setMessageNum({
        type:1,
        gidx,
        count: 0
      })
      push(`/chact/${allGroup.getIn([gidx,'_id'])}`);
    }else{
      setMessageNum({
        type:2,
        gidx,
        count: 0
      })
      push(`/chact/${myChact.getIn([gidx,'_id'])}`);
    }

  }
  searchGroup(val) {
    this.props.getGroupByName(val).then(result => {
      this.props.push('/group')
    }).catch(result => {
      message.error(result.message)
    })
  }
  render() {
    const {
      showSetting,
      theme,
      themeVisible,
      logoutVisible,
      groupVisible,
      deleteVisible,
      createError
    } = this.state;
    const {app ,auth ,myChact,activeItem,push} = this.props;
    if (!app.get('allGroup')) {
      return false;
    }
    const selectedKey = activeItem ? `${activeItem.get('key')}${activeItem.get('value')}` : '';
    const allGroup = app.get('allGroup');
    const img = require('source/photo.jpg');
    return (
      <div className={`chart theme${theme}`}>
        <div className='aside'>
          <img src={img} className='photo'/>
          <Icon type="usergroup-add" className='iconfont'/>
        </div>
        <div className='left'>
          <div className='left-title'>
            {auth.get('username')}
            <Icon type="ellipsis" className='iconfont' onClick={this.settingShow}/>
            {
              showSetting && <div className='setting'>
                {/*<div className='setItem'>
                  <Icon type="user-add" style={{ color: '#f1a52f' }}/>添加好友
                </div>*/}
                <div className='setItem' onClick={this.showCreate}>
                  <Icon type="usergroup-add" style={{ color: '#5788d9' }}/>创建群聊
                </div>
                <div className='setItem' onClick={this.changeModal.bind(this, 'themeVisible', true)}>
                  <Icon type="skin" style={{ color: '#70cc29' }}/>更换主题
                </div>
                <div className='setItem' onClick={push.bind(this,'/info')}>
                  <Icon type="setting" style={{ color: '#a645dc' }}/>信息编辑
                </div>
                <div className='setItem' onClick={this.changeModal.bind(this, 'logoutVisible', true)}>
                  <Icon type="export" style={{ color: '#ff435a' }}/>退出
                </div>
              </div>
            }
          </div>
          <div className='search'>
            <Search placeholder="搜索群聊加入" style={{ width: 200}} onSearch={this.searchGroup}/>
          </div>
          {allGroup.get('loading') ? <Spin/>: <div className='left-main'>
              {allGroup.get('success')
              ? <div className='list'>
                    <Menu className='friend-list' defaultOpenKeys={['group','chact']} mode="inline" selectedKeys={[selectedKey]}
                      onSelect={this.clickGroup.bind(this,push)}>
                      <SubMenu key="chact" title={<span>我的聊天</span>}>
                      {
                        myChact.size && myChact.map((value,index)=>{
                          const username = value.get('username');
                          return <Menu.Item key={`chact${index}`} className='item'>
                            <div className='photo'>{username.slice(0,1)}</div>
                            <p>{username}</p>
                             {value.get('noRead') ? <Badge count={value.get('noRead')} /> : ''}
                          </Menu.Item>
                        })
                      }
                      </SubMenu>
                      <SubMenu key="group" title={<span> 我的群聊 </span>}>
                        {allGroup.get('group').size && allGroup.get('group').map((value, index) => {
                            return <Menu.Item key={`group${index}`} className='item'>
                              {value.get('groupname')}
                              {value.get('noRead') ? <Badge count={value.get('noRead')} /> : ''}
                              <Icon type="delete" onClick= {this.changeModal.bind(this,'deleteVisible',true)}/>
                            </Menu.Item>
                          })
                        }
                      </SubMenu>
                    </Menu>
                  </div>
              : <div className='error'>哎呀，出错了呢，请稍后重试 ^o^</div>
              }
          </div>}
        </div>
        <div className='center'>
          {this.props.children}
        </div>
        <Modal visible={themeVisible} width={455} closable footer={null} className='themeModal' maskClosable={false}
          onCancel={this.changeModal.bind(this, 'themeVisible', false)}>
          <p className='title'>主题</p>
          <div className='themeBox'>
            <span className={`themeItem${theme == 1 ? ' activeTheme' : ''}`} style={{ background: '#E3E7EF' }}
              onClick={this.changeTheme.bind(this, 1)}>清凉蓝</span>
            <span className={`themeItem${theme == 2 ? ' activeTheme' : ''}`} style={{ background: '#FFEFE9' }}
              onClick={this .changeTheme.bind(this, 2)}>护眼橙</span>
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
          onCancel={this.changeModal.bind(this, 'logoutVisible', false)} onOk={this.logout}>
          您确定要退出吗？
        </Modal>
        <Modal visible={deleteVisible} width={400} closable className='deleteModal' maskClosable={false}
          onCancel={this.changeModal.bind(this, 'deleteVisible', false)} onOk={this.deleteGroup}>
          您确定要退出此群聊吗？
        </Modal>
        <Modal visible={groupVisible} width={455} closable className='groupModal' maskClosable={false}
          onCancel={this.changeModal.bind(this, 'groupVisible', false)} footer={null}>
          <div>
            <p className='title'>请输入要创建群聊的名称：</p>
            <Input type='text' maxLength={20} ref='groupname' defaultValue='' className={createError ? 'error' : ''}
              onChange={createError ? () => this.setState({createError: ''}) : null}/>
              {createError ? <p className='error-msg'>{createError}</p> : null}
            <div className='footer'>
              <Button icon="plus" onClick={this.createGroup}>
                确认创建
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const auth = state.get('auth');
  const app = state.get('app');
  const myChact = app.get('myChact');
  const allGroup = app.getIn(['allGroup','group']);
  const activeItem = app.get('activeItem');
  return {auth, app, myChact, allGroup,activeItem}
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    push,
    getGroup,
    createGroup,
    getGroupByName,
    setActive,
    reqSendMessage,
    setMessageNum,
    setDeleteGroup,
    createSpeChact,
    setOnlineCount
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
