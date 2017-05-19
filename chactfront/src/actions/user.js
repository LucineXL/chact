import socket from 'store/socket';

export const REQUEST_GETGROUP = 'REQUEST_GETGROUP';
export const REQUEST_GETGROUP_SUCCESS = 'REQUEST_GETGROUP_SUCCESS';
export const REQUEST_GETGROUP_FAIL = 'REQUEST_GETGROUP_FAIL';

export const REQUEST_GROUPBYNAME = 'REQUEST_GROUPBYNAME';
export const REQUEST_GROUPBYNAME_SUCCESS = 'REQUEST_GROUPBYNAME_SUCCESS';
export const REQUEST_GROUPBYNAME_FAIL = 'REQUEST_GROUPBYNAME_FAIL';

export const REQUEST_CREATEGROUP = 'REQUEST_CREATEGROUP';
export const REQUEST_CREATEGROUP_SUCCESS = 'REQUEST_CREATEGROUP_SUCCESS';
export const REQUEST_CREATEGROUP_FAIL = 'REQUEST_CREATEGROUP_FAIL';

export const REQUEST_GETUSERINFO = 'REQUEST_GETUSERINFO';
export const REQUEST_GETUSERINFO_SUCCESS = 'REQUEST_GETUSERINFO_SUCCESS';
export const REQUEST_GETUSERINFO_FAIL = 'REQUEST_GETUSERINFO_FAIL';

export const GET_ACTIVE = 'GET_ACTIVE';
export const REQUEST_SENDMESSAGE = 'REQUEST_SENDMESSAGE';
export const SET_MESSAGE_NUM = 'SET_MESSAGE_NUM';
export const CREATE_SPE_CHACT = 'CREATE_SPE_CHACT';

export function setActive(query){
  return (dispatch,getState) =>{
    const promise = dispatch({
     type: GET_ACTIVE,
     query
    })
    return promise;
  }
}

export function setMessageNum(query){
  return (dispatch,getState) =>{
    const promise = dispatch({
     type: SET_MESSAGE_NUM,
     query
    })
    return promise;
  }
}

export function reqSendMessage(query){
  return (dispatch,getState) =>{
    const promise = dispatch({
     type: REQUEST_SENDMESSAGE,
     query
    })
    return promise;
  }
}

export function createSpeChact(query){
  return (dispatch,getState) =>{
    const promise = dispatch({
     type: CREATE_SPE_CHACT,
     query
    })
    return promise;
  }
}

export function getGroup(username){
    return (dispatch,getState) =>{
        const promise = dispatch({
            types:[REQUEST_GETGROUP,REQUEST_GETGROUP_SUCCESS,REQUEST_GETGROUP_FAIL],
            api: action => action('/getGroup', 'post', {username:username}),
        })
        return promise;
    }
}
export function createGroup(query){
    return (dispatch,getState) =>{
        const promise = dispatch({
            types:[REQUEST_CREATEGROUP,REQUEST_CREATEGROUP_SUCCESS,REQUEST_CREATEGROUP_FAIL],
            api: action => action('/createGroup', 'post', query),
        })
        return promise;
    }
}
export function getGroupByName(groupname){
    return (dispatch,getState) =>{
        const promise = dispatch({
            types:[REQUEST_GROUPBYNAME,REQUEST_GROUPBYNAME_SUCCESS,REQUEST_GROUPBYNAME_FAIL],
            api: action => action('/groupByName', 'post', {groupname:groupname}),
        })
        return promise;
    }
}

export function getUserInfo(username){
    return (dispatch,getState) =>{
        const promise = dispatch({
            types:[REQUEST_GETUSERINFO,REQUEST_GETUSERINFO_SUCCESS,REQUEST_GETUSERINFO_FAIL],
            api: action => action('/getUserInfo', 'post', {username:username}),
        })
        return promise;
    }
}
