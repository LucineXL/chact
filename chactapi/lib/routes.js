const UserModel = require('./models/User');
const GroupModel = require('./models/Group');

module.exports = function (router, socket) {
  //查询用户名是否存在
  router.post('/findByName', async (req, res) => {
    const user = await UserModel.getUser(req.body.username);
    if (!user) {
      return res.json({
        success: true,
        result: {
          isExit: false
        }
      });
    } else {
      return res.json({
        success: true,
        result: {
          isExit: true
        }
      });
    }
  })
  //查询群聊是否存在
  router.post('/groupByName', async (req, res) => {
    const group = await GroupModel.getGroup(req.body.groupname);
    if (!group) {
      return res.json({
        success: false,
        result: {
          message:'您查询的群聊不存在，请检查后重试'
        }
      });
    } else {
      return res.json({
        success: true,
        result: {
          group:{
            groupname:group.groupname
          }
        }
      });
    }
  })
  // 注册账户
  router.post('/signup', (req, res) => {
    var newUser = new UserModel({
      username: req.body.username,
      password: req.body.password,
      sex: req.body.sex,
      birthday: req.body.birthday,
      email: req.body.email,
      addresss: req.body.addresss
    });
    // 保存用户账号
    newUser.save((err) => {
      if (err) {
        return res.json({
          success: false,
          result: {
            message: '注册失败!'
          }
        });
      }
      res.json({
        success: true,
        result: {
          message: '成功创建新用户!'
        }
      });
    });
  });
  //用户登录
  router.post('/login', (req, res) => {
    UserModel.findOne({
      'username': req.body.username
    }, (err, user) => {
      if (err) {
        throw err;
      }
      if (!user) {
        return res.json({
          success: false,
          result: {
            message: '认证失败,用户不存在!'
          }
        });
      } else if (user) {
        if (user.password == req.body.password) {
          UserModel
            .update({
              _id: user._id
            }, function (err) {});
          return res.json({
            success: true,
            result: {
              message: '认证成功',
              uid: user._id,
              username: user.username
            }
          });
        } else {
          return res.json({
            success: false,
            result: {
              message: '认证失败,密码错误!'
            }
          });
        }
      }
    })
  })
  //查找某用户所有的群聊
  router.post('/getGroup', async(req, res) => {
    const groups = await UserModel.getUserGroup(req.body.username);
    let groupList = [];
    if (groups.groups && groups.groups.length) {
      groups
        .groups
        .map(value => {
          groupList.push({_id: value._id, groupname: value.groupname})
          return groupList;
        })
    }
    return res.json({
      success: true,
      result: {
        group: groupList
      }
    })
  })
  //创建新群聊
  router.post('/createGroup', async(req, res) => {
    const user = await UserModel.getUser(req.body.username);
    if (user) {
      if (req.body.action == 1) {
        GroupModel.findOne({
          'groupname': req.body.groupname
        }, (err, group) => {
          if (err) {throw err;}
          if (!group) {
            var newGroup = new GroupModel({groupname: req.body.groupname});
            try {
              user
                .groups
                .push(newGroup);
              user.save();
              newGroup.save();
              return res.json({
                success: true,
                result: {
                  success_id: 1000,
                  message: '新建群聊成功'
                }
              })
            } catch (err) {
              return res.json({
                success: false,
                result: {
                  success_id: 2000,
                  message: '操作失败'
                }
              })
            }
          } else {
            return res.json({
              success: false,
              result: {
                success_id: 1002,
                message: '当前群聊已存在'
              }
            })
          }
        })
      } else {
        try {
          if (user.groups.indexOf(req.body._id) == -1) {
            user
              .groups
              .push(req.body._id);
            user.save();
            return res.json({
              success: true,
              result: {
                success_id: 1000,
                message: '加入群聊成功'
              }
            })
          } else {
            return res.json({
              success: false,
              result: {
                success_id: 1001,
                message: '当前群聊已加入'
              }
            })
          }
        } catch (err) {
          return res.json({
            success: false,
            result: {
              success_id: 2000,
              message: '操作失败'
            }
          })
        }
      }
    } else {
      return res.json({
        success: true,
        result: {
          success_id: 2000,
          message: '操作失败'
        }
      })
    }
  })
};
