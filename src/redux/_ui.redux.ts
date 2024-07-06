const initState: {[key: string]: any} = {
  theme: 'light',
  language: 'en',
  authModalActive: false,
  settingModalActive: false,
  userInfoModalActive: false,
}

export class UIActions {
  static AUTH_MODAL_TOGGLE = 'ui/authModalToggle'
  static SETTING_MODAL_TOGGLE = 'ui/settingModalToggle'
  static THEME_CHANGE = 'ui/themeChange'
  static LANGUAGE_CHANGE = 'ui/languageChange'
  static USER_INFO_MODAL_TOGGLE = 'ui/userInfoModalToggle'
}

export function ui(state = initState, action: any) {
  switch(action.type){
    case UIActions.AUTH_MODAL_TOGGLE:
      return {
        ...state,
        authModalActive: action.active !== undefined ? action.active : !state.authModalActive
      }
    case UIActions.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme
      }
    case UIActions.LANGUAGE_CHANGE:
      return {
        ...state,
        language: action.language
      }
    case UIActions.SETTING_MODAL_TOGGLE:
      return {
        ...state,
        settingModalActive: !state.settingModalActive
      }
    case UIActions.USER_INFO_MODAL_TOGGLE:
      return {
        ...state,
        userInfoModalActive: !state.userInfoModalActive
      }
    default:
      return state
  }
}