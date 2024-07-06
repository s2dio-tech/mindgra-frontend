export class ApiConst {
  static ERROR = "API_ERROR"
  static TOKEN_PREFIX = 'Bearer'
  static TOKEN_KEY = "xtoken"

  /**
   * auth
   */
  static LOGIN = "/auth/login"
  static LOGOUT = "/auth/logout"
  static REFRESH_TOKEN = "/auth/grant"
  static PASSWORD_FORGOT = "/auth/password-forgot"
  static PASSWORD_VERIFY_OTP = "/auth/password-verify-otp"
  static PASSWORD_RESET = "/auth/password-reset"


  static USERS = "/users"
  /**
   * words
   */
  static WORDS = '/words'
  static GRAPHS = '/graphs'
  static GRAPHS_DETAIL = (id: string) => `/graphs/${id}`
  static GRAPHS_DATA = (id: string) => `/graphs/${id}/data`
  static LINKS = '/links'
  
}
