import { createSagas } from "../../lib/redux";
import { flatten } from "lodash";
import { router as Router } from "expo-router";
import { put, call, CallEffect, PutEffect } from "redux-saga/effects";
import { ILogin, IFanRegister } from "@interfaces/auth";

import { authService } from "../../Screens/services/auth.service";
import { userService } from "../../Screens/services/user.service";

import { updateCurrentUser } from "../user/actions";
import {
  getCurrentUser,
  login,
  loginFail,
  loginSocial,
  loginSuccess,
  logout,
  signup,
  signupFail,
  signupSuccess,
} from "./actions";

import { ROUTES } from "@constants/Routes";

ROUTES;

const message = console;

const authSagas = [
  {
    on: login,
    *worker(data: any): Generator<CallEffect | PutEffect, void, any> {
      try {
        const payload = data.payload as ILogin;
        const resp = (yield call(authService.login, payload)).data;
        yield call(authService.setToken, resp.token, payload?.remember);
        const userResp = yield call(userService.me);
        yield put(updateCurrentUser(userResp.data));
        yield put(loginSuccess());
        Router.replace(ROUTES.HOME.ROOT as any);
      } catch (e) {
        const error: any = yield call(Promise.resolve, e);
        message.error(error?.message || "Incorrect credentials!");
        yield put(loginFail(error));
      }
    },
  },
  {
    on: signup,
    *worker(data: any): Generator<CallEffect | PutEffect, void, any> {
      try {
        const payload = data.payload as IFanRegister;
        const resp = (yield call(authService.register, payload)).data;
        yield call(authService.setToken, resp.token);
        const userResp = yield call(userService.me);
        yield put(updateCurrentUser(userResp.data));
        yield put(signupSuccess());
        Router.replace(ROUTES.HOME.ROOT as any);
      } catch (e) {
        const error: any = yield call(Promise.resolve, e);
        message.error(error?.message || "Signup failed!");
        yield put(signupFail(error));
      }
    },
  },
  {
    on: loginSocial,
    *worker(data: any): Generator<CallEffect | PutEffect, void, any> {
      try {
        const payload = data.payload as any;
        const { token } = payload;
        yield call(authService.setToken, token);
        const userResp = yield call(userService.me);
        yield put(updateCurrentUser(userResp.data));
        yield put(loginSuccess());
        if (!userResp?.data?.isPerformer) {
          Router.push(
            !userResp.data.email || !userResp.data.username
              ? "/user/account"
              : "/home"
          );
        }
        if (userResp?.data?.isPerformer) {
          !userResp.data.email || !userResp.data.username
            ? Router.push("/creator/account")
            : Router.push(
                {
                  pathname: "/[profileId]" as any,
                  params: {
                    profileId: userResp.data.username || userResp.data._id,
                  },
                } as any
              );
        }
      } catch (e) {
        const error = yield call(Promise.resolve, e);
        message.error(error?.message || "Incorrect credentials!");
        yield put(loginFail(error));
      }
    },
  },
  {
    on: logout,
    *worker(): Generator<CallEffect, void, any> {
      yield call(authService.removeToken);
      Router.replace("/login" as any);
    },
  },
  {
    on: getCurrentUser,
    *worker(): Generator<CallEffect | PutEffect, void, any> {
      try {
        const userResp = yield call(userService.me);
        yield put(updateCurrentUser(userResp.data));
      } catch (e) {
        const error = yield call(Promise.resolve, e);
        console.log(error);
      }
    },
  },
];

export default flatten([createSagas(authSagas)]);
