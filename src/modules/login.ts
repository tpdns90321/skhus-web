import { Dispatch } from 'redux';

import { SKHUS_API } from '../config';
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

export const idUpdate = (value: string) => ({ type: ID_UPDATE, payload: value });
export const pwUpdate = (value: string) => ({ type: PW_UPDATE, payload: value });
export const errorConfirm = () => ({ type: ERROR_CONFIRM });
const loginRequest = () => ({ type: REQUEST });
const Failed = (err: string) => ({ type: FAILED, payload: err });
const Success = (result: LoginResult) => ({ type: SUCCESS, payload: result });
export const Logout = () => ({ type: LOGOUT });

type LoginAction = 
  | ReturnType<typeof idUpdate>
  | ReturnType<typeof pwUpdate>
  | ReturnType<typeof loginRequest>
  | ReturnType<typeof Failed>
  | ReturnType<typeof Success>
  | ReturnType<typeof errorConfirm>
  | ReturnType<typeof Logout>;

type Credential =
  | {
      Old: string,
      New: string,
      NewToken: string,
  }
  | {
      Old: boolean,
      New: boolean,
      NewToken: boolean,
  };

type LoginState = {
  id: string,
  pw: string,
  waiting: boolean,
  error: string,
  credential: Credential,
};

const initialState: LoginState = {
  id: '',
  pw: '',
  waiting: false,
  error: '',
  credential: {
    Old: '',
    New: '',
    NewToken: '',
  }
}

export function Request() {
  return (dispatch: Dispatch<LoginAction>, getState: ()=>RootState) => {
    dispatch(loginRequest());
    const login = getState().login;
    console.log(login);
    if (login.id === '' || login.pw === '') {
      dispatch(Failed('id 또는 password가 비워져 있습니다.'));
      return;
    } else if (login.pw.length <= 7) {
      dispatch(Failed('password의 길이가 최소 8자리 이상이여야 합니다.'));
    }
    const fetchLogin = (loginType: 'credential-old' | 'credential-new') =>
      fetch(SKHUS_API + "/user/login", {
        method: 'POST',
        cache: 'no-cache',
        body: JSON.stringify({
          "userid": login.id,
          "userpw": login.pw,
          "type":   loginType,
        }),
        credentials: 'include',
      }).then(response => response.json())
        .then((result: LoginResult) => {
          if (result.error !== '') {
            dispatch(Failed(result.error));
            return
          }

          dispatch(Success(result));
        })
        .catch(err => {
          dispatch(Failed(err.toString()));
        });

    fetchLogin('credential-old');
    fetchLogin('credential-new');
  };
};

function login(state: LoginState = initialState, action: LoginAction) {
  switch (action.type) {
    case ID_UPDATE:
      return { ...state, id: action.payload, };
    case PW_UPDATE:
      return { ...state, pw: action.payload, };
    case REQUEST:
      return { ...state, waiting: true };
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

      if (action.payload['credential-old'] !== undefined) {
        credential.Old = action.payload['credential-old'];
      } else if (action.payload['credential-new'] !== undefined &&
        action.payload['credential-new-token'] !== undefined) {
        credential.New = action.payload['credential-new'];
        credential.NewToken = action.payload['credential-new-token'];
      }

      var keep = true;

      if (credential.Old !== '' &&
        credential.New !== '' &&
        credential.NewToken !== '') {
        keep = false;
      }

      return { ...state, waiting: keep, credential: credential };
    case ERROR_CONFIRM:
      return { ...state, error: '' };
    case LOGOUT:
      return {
        ...state,
        credential: {
          NewToken: '',
          New: '',
          Old: '',
        },
        id: '',
        pw: '',
      };
    default:
      return state;
  }
}

export function isLogin(login: LoginState) {
  return login.credential.New !== '' &&
    login.credential.NewToken !== '' &&
    login.credential.Old !== ''
}

export default login;
