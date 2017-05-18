import * as user from 'actions/user';
export default (state = Immutable.Map(), action) => {
    const { result } = action;
    switch (action.type) {
        case user.REQUEST_GETGROUP:
        case user.REQUEST_GETGROUP_SUCCESS:
        case user.REQUEST_GETGROUP_FAIL:
        {
            return state.merge(Immutable.fromJS({
              allGroup:result
            }));
        }
        case user.REQUEST_GROUPBYNAME_SUCCESS:{
            return state.merge(Immutable.fromJS({
                groupByName:result.group
            }))
        }
        case user.GET_ACTIVE_GROUP:{
            const {index} = action; 
            return state.merge(Immutable.fromJS({
                activeGroup: index
            }))
        }
        case user.REQUEST_SENDMESSAGE:{
            const {gidx,message} = action.query;
            let messages = state.getIn(['allGroup','group',gidx,'message']).toJS();
            messages.push(message);
            return state.updateIn(['allGroup','group',gidx],value=>{
                return value.merge(Immutable.fromJS({'message':messages}))
            })
        }
        case user.SET_MESSAGE_NUM:{
            const {count,gidx} = action.query;
            return state.updateIn(['allGroup','group',gidx],value=>{
                return value.merge(Immutable.fromJS({'noRead':count}))
            })
        }
        case user.REQUEST_GETUSERINFO:
        case user.REQUEST_GETUSERINFO_SUCCESS:
        case user.REQUEST_GETUSERINFO_FAIL:{
            return state.merge(Immutable.fromJS({
                userInfo:result
            }))
        }
        default: {
            return state;
        }
    }
}
