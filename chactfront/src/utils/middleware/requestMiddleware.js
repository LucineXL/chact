/**
 *
 * api请求中件间
 *
 * 返回结果格式{
 *      success: true|false //请求是否成功
 *      msg: '', // 信息
 *      loading: true|false // 是否loading
 *      data:{} 服务返回数据
 * }
 *
 */
import apiClient from '../apiClient';
export default () => {
    return ({
        dispatch,
        getState
    }) => {
        return next => action => {
            if (typeof action === 'function') {
                return action(dispatch, getState);
            }

            const {
                api,
                types
            } = action;
            if (!api) {
                return next(action);
            }
            const [REQUEST, SUCCESS, FAILURE] = types;
            next(Object.assign(action, {
                type: REQUEST,
                result: {
                    loading: true,
                    success: false
                }
            }));
            const resolveFn = (result, resolve) => {
                Object.assign(result, {
                    success: true,
                    loading: false
                })
                next(Object.assign(action, {
                    result,
                    type: SUCCESS
                }));
                resolve(result)
            };

            const rejectFn = (result, reject) => {
                Object.assign(result, {
                    success: false,
                    loading: false,
                    msg: (result.error && result.error_str) ? result.error_str : '网络错误'
                })
                next(Object.assign(action, {
                    result,
                    type: FAILURE
                }));
                reject(result);
            };
            return new Promise((resolve, reject) => {
                api((path,type,query) => {
                    query = query || {}
                    apiClient(path,type,query).then(result => {
                        resolveFn(result, resolve)
                    }).catch(result => {
                        rejectFn(result, reject)
                    });
                })
            })
        };
    };
}
