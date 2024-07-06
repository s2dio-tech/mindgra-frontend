import { createStore as _createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createWrapper} from 'next-redux-wrapper';
import apiMiddleware from './apiMiddleware';

import { ApiFactory } from '../api/Api';

import { auth } from './_auth.redux';
import { graph } from './_graph.redux';
import { word } from './_word.redux';
import { ui } from './_ui.redux';

const reducer = combineReducers({
  auth,
  graph,
  word,
  ui
});

export function createStore(api = null) {
  const getLocalStorage = () => {
    try {
      const {user, token, refreshToken} = JSON.parse(localStorage.getItem('credential') || '{}');
      let lst = {
        auth: {
          user, token, refreshToken
        }
      }
      const ui = JSON.parse(localStorage.getItem('ui') || '{}');
      if(ui) {
        lst.ui = ui
      }
      return lst
    } catch (err) {}
  }
  
  const saveLocalStorage = (state) => {
    try {
      const {user, token, refreshToken} = state.auth || {}
      localStorage.setItem('credential', JSON.stringify({user, token, refreshToken}));
      localStorage.setItem('ui', JSON.stringify({
        theme: state.ui.theme,
        language: state.ui.language,
      }));
    } catch (err) {}
  }

  const middlewares = [thunkMiddleware, apiMiddleware(api)];
  if (process.env.NODE_ENV !== `production`) {
    const loggerMiddleware = createLogger();
    middlewares.push(loggerMiddleware);
  }

  const store = _createStore(
    reducer,
    getLocalStorage(),
    applyMiddleware(...middlewares)
  )

  store.subscribe(() => {
    saveLocalStorage(store.getState())
  });

  return store
}

const api = new ApiFactory();
export const wrapper = createWrapper(() => createStore(api))