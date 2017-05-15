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
        default: {
            return state;
        }
    }
}
