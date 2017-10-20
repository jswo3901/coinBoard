// Home CONTROLLER
import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import * as API from 'lib/api/auth'

// 액션 타입 정의
const INPUT = 'app/login/INPUT' // 인풋 입력
// 로그인
const LOGIN_VALIDATION = 'app/login/LOGIN_VALIDATION'
const LOGIN = 'app/login/LOGIN'
const LOGIN_SUCCESS = 'app/login/LOGIN_SUCCESS'

const IS_LOGIN = 'app/login/IS_LOGIN'
const REFRESH_ACCESS = 'app/login/REFRESH_ACCESS'

// 액션 생성자
export const input = createAction(INPUT) // name, value
export const loginValidation = createAction(LOGIN_VALIDATION)
export const login = createAction(LOGIN, API.loginAPI)
export const isLogin = createAction(IS_LOGIN, API.isLoginAPI)
export const refreshAccess = createAction(REFRESH_ACCESS, API.refreshAccessAPI)

const initialState = Map({
  login: Map({
    loginEmail:'',
    loginPassword:'',
    message:'',
    result:false,
  })
})

export default handleActions({
  [INPUT]: (state, action) => {
    const { name, value } = action.payload
    return state.setIn(['login', name], value)
  },
  // 로그인
  [LOGIN_VALIDATION]: (state, action) => {
    return state.setIn(['login', 'message'], '이메일과 비밀번호를 모두 입력하세요')
  },
  [LOGIN_SUCCESS]: (state, action) => {
    return state.setIn(['login', 'message'], action.payload.data.data.msg)
  },
}, initialState)