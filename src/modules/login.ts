import { Dispatch } from 'redux';

import { forestAPI } from './apis';
import { RootState } from './index';

const ID_UPDATE = 'login/ID_UPDATE' as const;
const PW_UPDATE = 'login/PW_UPDATE' as const;
const REQUEST = 'login/REQUEST' as const;
const FAILED = 'login/FAILED' as const;
const SUCCESS = 'login/SUCCESS' as const;
const ERROR_CONFIRM = 'login/ERROR_CONFIRM' as const;
const LOGOUT = 'login/LOGOUT' as const;

type LoginResult = {
  'credential-old'?: string,
  'credential-new'?: string,
  'credential-new-token'?: string,
  'error': string,
}

// id update
export const idUpdate = (value: string) => ({ type: ID_UPDATE, payload: value });
// password update
export const pwUpdate = (value: string) => ({ type: PW_UPDATE, payload: value });
export const errorConfirm = () => ({ type: ERROR_CONFIRM });
// 로그인 시작, 쿠키 모드
const loginRequest = (isCookie: boolean) => ({ type: REQUEST, payload: isCookie });
// 로그인 시작
const Failed = (err: string) => ({ type: FAILED, payload: err });
// 로그인 성공
const Success = (result: LoginResult) => ({ type: SUCCESS, payload: result });
// 로그아웃
export const Logout = () => ({ type: LOGOUT });

type LoginAction = 
  | ReturnType<typeof idUpdate>
  | ReturnType<typeof pwUpdate>
  | ReturnType<typeof loginRequest>
  | ReturnType<typeof Failed>
  | ReturnType<typeof Success>
  | ReturnType<typeof errorConfirm>
  | ReturnType<typeof Logout>;

type Credential = {
  Old?: string | boolean,
  New?: string,
  NewToken?: string,
};

type LoginState = {
  id: string,
  pw: string,
  isCookie: boolean,
  waiting: boolean,
  error: string,
  credential: Credential,
};

const initialState: LoginState = {
  id: '',
  pw: '',
  isCookie: false,
  waiting: false,
  error: '',
  credential: { }
}

export function Request(isCookie: boolean = false) {
  return async (dispatch: Dispatch<LoginAction>, getState: ()=>RootState) => {
    // 로그인 시작 설정
    dispatch(loginRequest(isCookie));
    const login = getState().login;

    // 로그인 조건 확인
    if (login.id === '' || login.pw === '') {
      dispatch(Failed('id 또는 password가 비워져 있습니다.'));
      return;
    } else if (login.pw.length < 8) {
      dispatch(Failed('password의 길이가 최소 8자리 이상이여야 합니다.'));
    }
    const fetchLogin = (loginType: 'credential-old' | 'credential-new') =>
      forestAPI.post("/user/login",
        JSON.stringify({
          "userid": login.id,
          "userpw": login.pw,
          "type":   loginType,
        })
      );

    try {
      let forestResult = fetchLogin('credential-old');
      if (isCookie) {
        dispatch(Success((await forestResult).data));
        return;
      }
      let samResult = fetchLogin('credential-new');
      dispatch(Success((await forestResult).data));
      dispatch(Success((await samResult).data));
    } catch (err) {
      if (err.response) {
        dispatch(Failed(err.response.data.error));
      }
      dispatch(Failed(err.toString()));
    }
  };
};

function login(state: LoginState = initialState, action: LoginAction) {
  switch (action.type) {
    case ID_UPDATE:
      return { ...state, id: action.payload, };
    case PW_UPDATE:
      return { ...state, pw: action.payload, };
    case REQUEST:
      return { ...state, isCookie: action.payload, waiting: true };
    case FAILED:
      if (state.error !== '')
        return state;
      return { ...state, waiting: false, error: action.payload, credential: {
        Old: '',
        New: '',
        NewToken: '',
      }};
    case SUCCESS:
      var credential = state.credential;

      if (action.payload['credential-old']) {
        if (state.isCookie)
          credential.Old = true;
        else
          credential.Old = action.payload['credential-old'];
      } else if (action.payload['credential-new'] &&
        action.payload['credential-new-token']) {
        credential.New = action.payload['credential-new'];
        credential.NewToken = action.payload['credential-new-token'];
      }

      var keep = true;

      if ((credential.Old &&
        credential.New &&
        credential.NewToken) || state.isCookie) {
        keep = false;
      }

      return { ...state, waiting: keep, credential: credential };
    case ERROR_CONFIRM:
      return { ...state, error: '' };
    case LOGOUT:
      return {
        ...state,
        credential: {},
        id: '',
        pw: '',
      };
    default:
      return state;
  }
}

export function isLogin(login: LoginState) {
  if (login.isCookie) {
    return login.credential.Old;
  }
  return login.credential.New &&
    login.credential.NewToken &&
    login.credential.Old
}

export default login;
