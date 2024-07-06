import { actionFail, actionSuccess } from ".";
import { ApiConst } from "../common/api";
import { JwtHelper } from "../common/jwt";
import { AuthActions } from "./_auth.redux";

const apiRequest = (store, action, api) => {
  return new Promise((resolve, reject) => {
    
    const {type: REQUEST, promise} = action
    const actionPromise = promise(api, store);
    actionPromise.then(
      (data) => {
        store.dispatch({type: actionSuccess(REQUEST), data})
        resolve(data)
      },
      (error) => {
        store.dispatch({type: actionFail(REQUEST), error})
        reject(error)
      }
    ).catch((error)=> {
      // console.error('MIDDLEWARE ERROR:', error);
      reject(error)
    });
  })
}

const startApiRequest = (next, action) => {
  const {type: REQUEST, promise, ...rest} = action
  next({type: REQUEST, ...rest});
}

const rejectApiRequest = (store, action) => {
  return new Promise((resolve, reject) => {
    const {type: REQUEST} = action
    store.dispatch({type: actionFail(REQUEST), error})
    reject(error)
  })
}

export default function apiMiddleware(api) {
  return store => next => action => {

    if (typeof action.promise === 'function') {
      
      startApiRequest(next, action)

      // if action doesnt require secure, next
      // ex: login request
      if(!action.secure) {
        return apiRequest(store, action, api);
      }

      const token = store.getState().auth.token;
      const refreshToken = store.getState().auth.refreshToken;

      // if refresh token is invalid, force login to get new refresh token
      if(!token || !refreshToken || !JwtHelper.isValid(refreshToken)) {
        next({
          type: AuthActions.LOGOUT
        })
        return rejectApiRequest(store, action)
      }
      

      // if refresh token is valid, try request new token,
      // next
      if(!JwtHelper.isValid(token) || (JwtHelper.expiresAt(token) - new Date().getTime() >= 300000)) {
        //request token
        return api.post(ApiConst.REFRESH_TOKEN, {refreshToken})
          .then(
            (result) => {
              api.token = result.token;
              next({
                type: AuthActions.SET_TOKEN, data: result
              });
            },
            error => {
              next({
                type: LOGOUT, error
              })
              return rejectApiRequest(store, action)
            },
          )
          .then(() => apiRequest(store, action, api))
      }

      // if token still valid and expires enough long
      // then next
      api.token = token;
      return apiRequest(store, action, api);
    }

    next(action)
  }
}


