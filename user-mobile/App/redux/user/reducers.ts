import { createReducers } from '../../lib/redux';
import { logout } from '../auth/actions'
import { merge } from 'lodash';
import { IReduxAction, IUser } from '../../interfaces';

import {
  setUpdating,
  updateBalance,
  updateCurrentUser,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
  updatePasswordFail,
  updatePasswordSuccess,
  updateUserFail,
  updateUserSuccess
} from './actions';

const initialState = {
  current: {
    _id: null,
    avatar: '/no-avatar.jpg',
    cover: null,
    name: '',
    email: ''
  },
  error: null,
  updateSuccess: false,
  updating: false
};

const userReducers = [
  {
    on: updateCurrentUser,
    reducer(state: any, data: any) {
      return {
        ...state,
        current: data.payload
      };
    }
  },
  {
    on: updateCurrentUserAvatar,
    reducer(state: any, data: any) {
      return {
        ...state,
        current: {
          ...state.current,
          avatar: data.payload
        }
      };
    }
  },
  {
    on: updateCurrentUserCover,
    reducer(state: any, data: any) {
      return {
        ...state,
        current: {
          ...state.current,
          cover: data.payload
        }
      };
    }
  },
  {
    on: updateUserSuccess,
    reducer(state: any, data: IReduxAction<IUser>) {
      return {
        ...state,
        current: data.payload,
        updateSuccess: true,
        error: null
      };
    }
  },
  {
    on: updateUserFail,
    reducer(state: any, data: IReduxAction<any>) {
      return {
        ...state,
        updateUser: null,
        updateSuccess: false,
        error: data.payload
      };
    }
  },
  {
    on: setUpdating,
    reducer(state: any, data: IReduxAction<boolean>) {
      return {
        ...state,
        updating: data.payload
      };
    }
  },
  {
    on: updatePasswordSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      return {
        ...state,
        updateSuccess: true,
        updatedPassword: data.payload,
        error: null
      };
    }
  },
  {
    on: updatePasswordFail,
    reducer(state: any, data: IReduxAction<any>) {
      return {
        ...state,
        updateSuccess: false,
        updatedPassword: null,
        error: data.payload
      };
    }
  },
  {
    on: updateBalance,
    reducer(state: any, data: any) {
      const nextState = { ...state };
      const { token } = data.payload;
      nextState.current.balance += token;
      return {
        ...nextState
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

export default merge({}, createReducers('user', [userReducers], initialState));
