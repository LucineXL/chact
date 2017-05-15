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
