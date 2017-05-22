import * as user from 'actions/user';
export default (state = Immutable.Map(), action) => {
    const { result } = action;
    switch (action.type) {
        case user.REQUEST_GETGROUP:
        case user.REQUEST_GETGROUP_SUCCESS:
        case user.REQUEST_GETGROUP_FAIL:
        {
            return state.merge(Immutable.fromJS({
              allGroup:result,
              myChact:[]
            }));
        }
        case user.REQUEST_GROUPBYNAME_SUCCESS:{
            return state.merge(Immutable.fromJS({
                groupByName:result.group
            }))
        }
        case user.GET_ACTIVE:{
            const {query} = action; 
            return state.merge(Immutable.fromJS({
                activeItem: query
            }))
        }
        case user.SET_ONLINECOUNT:{
            const {count} = action;
            return state.merge(Immutable.fromJS({
                onlineCount: count
            }))
        }
        case user.REQUEST_SENDMESSAGE:{
            const {gidx,message} = action.query;
            if(message.type == 1){
                let messages = state.getIn(['allGroup','group',gidx,'message']).toJS();
                messages.push(message);
                return state.updateIn(['allGroup','group',gidx],value=>{
                    return value.merge(Immutable.fromJS({'message':messages}))
                })
            }else{
                console.log(gidx);
                if(gidx == -1){
                    let myChact = [];
                    myChact.push({
                        _id:message.user._id,
                        username:message.user.username,
                        message:[
                            message
                        ]
                    })
                    return state.update('myChact',value=>{
                        return value.merge(Immutable.fromJS(myChact))
                    })
                }else{
                    let messages = state.getIn(['myChact',gidx,'message']).toJS();
                    console.log(message);
                    messages.push(message);
                    console.log(messages)
                    return state.updateIn(['myChact',gidx,'message'],value=>{
                        return value.merge(Immutable.fromJS(messages))
                    })
                }
            }
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
        case user.CREATE_SPE_CHACT:{
            const {query} = action;
            let myChact = state.get('myChact').toJS();
            myChact.push(Object.assign(query,{message:[]}));
            return state.update('myChact',value=>{
                return value.merge(Immutable.fromJS(myChact))
            })
        }
        default: {
            return state;
        }
    }
}
