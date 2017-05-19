import socket from 'store/socket';
export const REQUEST_SIGNUP = 'REQUEST_SIGNUP';
export const REQUEST_SIGNUP_SUCCESS = 'REQUEST_SIGNUP_SUCCESS';
export const REQUEST_SIGNUP_FAIL = 'REQUEST_SIGNUP_FAIL';
export const REQUEST_FINDBYNAME = 'REQUEST_FINDBYNAME';
export const REQUEST_FINDBYNAME_SUCCESS = 'REQUEST_FINDBYNAME_SUCCESS';
export const REQUEST_FINDBYNAME_FAIL = 'REQUEST_FINDBYNAME_FAIL';
export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const REQUEST_LOGIN_SUCCESS = 'REQUEST_LOGIN_SUCCESS';
export const REQUEST_LOGIN_FAIL = 'REQUEST_LOGIN_FAIL';
export const REQUEST_AUTH_INIT = 'REQUEST_AUTH_INIT';


function storageAuth(auth) {
    sessionStorage.setItem('auth', JSON.stringify(auth));
}
export function requestAuthInit(){
  return (dispatch,getState) =>{
    const promise = dispatch({
     type: REQUEST_AUTH_INIT,
    })
    return promise;
  }
}

export function requestSignup(query){
    return (dispatch,getState) =>{
        const promise = dispatch({
            types:[REQUEST_SIGNUP,REQUEST_SIGNUP_SUCCESS,REQUEST_SIGNUP_FAIL],
            api: action => action('/signup', 'post', query),
        })
        return promise;
    }
}
export function requestFindByName(query){
    return (dispatch,getState) =>{
        const promise = dispatch({
            types:[REQUEST_FINDBYNAME,REQUEST_FINDBYNAME_SUCCESS,REQUEST_FINDBYNAME_FAIL],
            api: action => action('/findByName', 'post', query),
        })
        return promise;
    }
}
export function requestLogin(query){
    return (dispatch,getState) =>{
        const promise = dispatch({
            types:[REQUEST_LOGIN,REQUEST_LOGIN_SUCCESS,REQUEST_LOGIN_FAIL],
            api: action => action('/login', 'post', query),
        })
        promise.then(result=>{
            storageAuth({
              uid:result.uid,
              username:result.username
            });
            socket.emit('login',{'username':result.username});
        })
        return promise;
    }
}
