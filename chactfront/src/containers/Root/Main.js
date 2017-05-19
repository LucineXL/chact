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
import {getGroup, createGroup, getGroupByName,setActive,reqSendMessage,setMessageNum} from 'actions/user';
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
    this.logout = this.logout.bind(this);


    this.getGroupIndex = this.getGroupIndex.bind(this);
    this.state = {
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
      getGroup(auth.get('username')).then((result)=>{
        socket.emit('joinGroup',{
          groups:result.group,
          username:auth.get('username')
        })
      });
    }
  }
  componentDidMount(){
    socket.on('message', (message) => {
        this.getGroupIndex(message);
    })
    socket.on('systemInfo', (systemInfo) => {
      message.info(systemInfo);
    })
  }
  getGroupIndex(message){
    const {app, auth,activeItem,allGroup,reqSendMessage,setMessageNum} = this.props;
    const {content,groupname,timestamp,type,user} = message;
    const gidx = allGroup.findIndex(item=>item.get('groupname')== message.groupname);
    const noRead = allGroup.getIn([gidx,'noRead']) ? allGroup.getIn([gidx,'noRead']) : 0;
    reqSendMessage({
      gidx,
      message:{
        content,timestamp,type,user
      }
    })
    if(activeItem.get('key') == 'group' && activeItem.get('value') != gidx){
      setMessageNum({
        gidx,
        count: parseInt(noRead)+1
      })
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
    const {auth, createGroup, getGroup} = this.props;
    const username = auth.get('username');
    this.createError = '';
    this.setState({
      createError: ''
    }, () => {
      createGroup({action: 1, username, groupname: this.refs.groupname.refs.input.value}).then(() => {
        this.changeModal('groupVisible', false);
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
        gidx,
        count: 0
      })
      push(`/chact/${allGroup.getIn([gidx,'_id'])}`);
    }else{
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
      createError
    } = this.state;
    const {app ,myChact,push} = this.props;
    if (!app.get('allGroup')) {
      return false;
    }
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
            CHACT
            <Icon type="ellipsis" className='iconfont' onClick={this.settingShow}/> 
            {
              showSetting && <div className='setting'>
                <div className='setItem'>
                  <Icon type="user-add" style={{ color: '#f1a52f' }}/>添加好友
                </div>
                <div className='setItem' onClick={this.showCreate}>
                  <Icon type="usergroup-add" style={{ color: '#5788d9' }}/>创建群聊
                </div>
                <div className='setItem' onClick={this.changeModal.bind(this, 'themeVisible', true)}>
                  <Icon type="skin" style={{ color: '#70cc29' }}/>更换主题
                </div>
                <div className='setItem'>
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
                    <Menu className='friend-list' defaultOpenKeys={['group','chact']} mode="inline" onSelect={this.clickGroup.bind(this,push)}>
                      <SubMenu key="chact" title={<span>我的聊天</span>}>
                      {
                        myChact.size && myChact.map((value,index)=>{
                          const username = value.get('username');
                          return <Menu.Item key={`chact${index}`} className='item'>
                            <div className='photo'>{username.slice(0,1)}</div>
                            <p>{username}</p>
                          </Menu.Item>
                        })
                      }
                      </SubMenu>
                      <SubMenu key="group" title={<span> 我的群聊 </span>}>
                        {allGroup.get('group').size && allGroup.get('group').map((value, index) => {
                            return <Menu.Item key={`group${index}`} className='item'>
                              {value.get('groupname')}
                              {value.get('noRead') ? <Badge count={value.get('noRead')} /> : ''}
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
    setMessageNum
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
