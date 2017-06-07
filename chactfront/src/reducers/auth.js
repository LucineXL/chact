import * as auth from 'actions/auth';
export default (state = Immutable.Map(), action) => {
    const {result} = action;
    switch (action.type) {
        case auth.REQUEST_AUTH_INIT: {
            const auth = sessionStorage.getItem('auth');
            return state.merge(Immutable.fromJS(JSON.parse(auth)));
        }
        case auth.REQUEST_UPDATE:
        case auth.REQUEST_UPDATE_FAIL:{
            return state.merge(Immutable.fromJS(result))
        }
        case auth.REQUEST_UPDATE_SUCCESS:{
            const {query,result:{loading,success}} = action;
            return state.merge(Immutable.fromJS(Object.assign(query,loading,success)))
        }
        default: {
            return state;
        }
    }
}
