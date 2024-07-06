import { actionFail, actionSuccess } from '.';
import { ApiConst } from '../common/api'


export class AuthActions {
  static ASYNC_START = 'ASYNC_START';
  static LOGIN = 'auth/LOGIN';
  static LOGOUT = 'auth/LOGOUT';
  static REGISTER = 'auth/REGISTER';
  static FORGOT_PASSWORD = 'auth/FORGOT_PASSWORD';
  static VERIFY_PASSWORD_OTP = 'auth/VERIFY_PASSWORD_OTP';
  static RESET_PASSWORD = 'auth/RESET_PASSWORD';
  static GRANT = 'auth/GRANT';
  static SET_TOKEN = 'auth/SET_TOKEN';
}


const initialState = {
  loading: false,
  user: null,
  token: null,
  refreshToken: null,
  error: null
}

export function loginAction(data) {
  return {
    type: AuthActions.LOGIN, 
    promise: api => api.post(ApiConst.LOGIN, data)
  }
}

export function registerAction(data) {
  return {
    type: AuthActions.REGISTER,
    promise: api => api.post(ApiConst.USERS, data)
  }
}

export function logoutAction() {
  return { type: AuthActions.LOGOUT }
}

export function grantNewTokenAction(data) {
  return {
    type: AuthActions.GRANT,
    promise: ((client) => {
      return client.post(ApiConst.REFRESH_TOKEN , data)
    })
  }
}

export function forgotPasswordAction (data) {
  return {
    type: AuthActions.FORGOT_PASSWORD,
    promise: ((client) => {
      return client.post(ApiConst.PASSWORD_FORGOT, data)
    })
  }
}

export function verifyPasswordResetOTPAction (data) {
  return {
    type: AuthActions.VERIFY_PASSWORD_OTP,
    promise: ((client) => {
      return client.post(ApiConst.PASSWORD_VERIFY_OTP, data)
    })
  }
}

export function resetPasswordAction(data) {
  return {
    type: AuthActions.RESET_PASSWORD,
    promise: ((client) => {
      return client.post(ApiConst.PASSWORD_RESET, data)
    })
  }
}

export function auth(state = initialState, action) {
  switch (action.type) {
    case AuthActions.LOGIN:
    case AuthActions.REGISTER:
      return {
        ...state,
        loading: true
      }
    case actionSuccess(AuthActions.LOGIN):
    case actionSuccess(AuthActions.REGISTER):
      return {
        ...state, 
        loading: false, 
        user: action.data.user,
        token: action.data.token,
        refreshToken: action.data.refreshToken
      }
    case actionFail(AuthActions.LOGIN):
    case actionFail(AuthActions.REGISTER):
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case AuthActions.LOGOUT:
      return {
        ...state,
        token: null,
        refreshToken: null,
        user: null
      }

    case AuthActions.SET_TOKEN:
      return {
        ...state,
        loading:false,
        token: action.data.token,
      };
    case AuthActions.GRANT:
      return {
        ...state,
        loading: true
      }
    case actionSuccess(AuthActions.GRANT):
      return {
        ...state,
        loading: false,
        token: action.data.token,
      }
    case actionFail(AuthActions.GRANT):
      return {
        ...state,
        loading: false,
        token: null,
        refreshToken: null,
        isAuthenticated: false
      }
    default:
      return state
  }
}
