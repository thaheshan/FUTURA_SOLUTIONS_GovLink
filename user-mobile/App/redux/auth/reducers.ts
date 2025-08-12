import { createReducers } from '@lib/redux';
import { merge } from 'lodash';

import {
  login,
  loginFail,
  loginPerformer,
  loginSuccess,
  logout,
  signup,
  signupFail,
  signupSuccess
} from './actions';

const initialState = {
  loggedIn: false,
  authUser: null,
  loginAuth: {
    requesting: false,
    error: null,
    data: null,
    success: false
  },
  signupAuth: {
    requesting: false,
    error: null,
    data: null,
    success: false
  }
};

const authReducers = [
  {
    on: login,
    reducer(state: any) {
      return {
        ...state,
        loginAuth: {
          requesting: true,
          error: null,
          data: null,
          success: false
        }
      };
    }
  },
  {
    on: signup,
    reducer(state: any) {
      return {
        ...state,
        signupAuth: {
          requesting: true,
          error: null,
          data: null,
          success: false
        }
      };
    }
  },
  {
    on: loginPerformer,
    reducer(state: any) {
      return {
        ...state,
        loginAuth: {
          requesting: true,
          error: null,
          data: null,
          success: false
        }
      };
    }
  },
  {
    on: loginSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        loggedIn: true,
        loginAuth: {
          requesting: false,
          error: null,
          data: data.payload,
          success: true
        }
      };
    }
  },
  {
    on: signupSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        signupAuth: {
          requesting: false,
          error: null,
          data: data.payload,
          success: true
        }
      };
    }
  },
  {
    on: loginFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        loggedIn: false,
        loginAuth: {
          requesting: false,
          error: data.payload,
          success: false
        }
      };
    }
  },
  {
    on: signupFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        signupAuth: {
          requesting: false,
          error: data.payload,
          success: false
        }
      };
    }
  },
  {
    on: logout,
    reducer() {
      return {
        ...initialState
      };
    }
  }
];

export default merge({}, createReducers('auth', [authReducers], initialState));
