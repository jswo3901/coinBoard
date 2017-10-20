// Home CONTROLLER
import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import * as API from 'lib/api/auth'

// 액션 타입 정의
const CLEAN_STATE = 'app/register/CLEAN_STATE' // state 초기화
const INPUT = 'app/register/INPUT' // 인풋 입력
const CHECK = 'app/register/CHECK' // 회원가입 약관 동의
// 회원가입 axios
const REGISTER = 'app/register/REGISTER' // 회원가입
const REGISTER_LOADING = 'app/register/REGISTER_LOADING'
const REGISTER_SUCCESS = 'app/register/REGISTER_SUCCESS'
// 재전송
const RE_CONFIRM = 'app/register/RE_CONFIRM' // 재전송
const RE_CONFIRM_SUCCESS = 'app/register/RE_CONFIRM_SUCCESS'

// 액션 생성자
export const input = createAction(INPUT) // name, value
export const check = createAction(CHECK) // ckeckData
export const cleanState = createAction(CLEAN_STATE) // ckeckData
export const register = createAction(REGISTER, API.registerAPI)
export const reConfirm = createAction(RE_CONFIRM, API.reConfirmAPI)

const initialState = Map({
  register: Map({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    check: false,
    message: '',
    result: false,
    emailReInput: '',
    reConfirmMessage: ''
  }),
})

export default handleActions({
  [RE_CONFIRM_SUCCESS]: (state, action) => {
    return state.setIn(['register', 'reConfirmMessage'], action.payload.data.msg)
  },  
  [CLEAN_STATE]: (state, action) => {
    return state.setIn(['register', 'result'], false)
      .setIn(['register', 'email'], '')
      .setIn(['register', 'password'], '')
      .setIn(['register', 'passwordConfirm'], '')
      .setIn(['register', 'nickname'], '')
      .setIn(['register', 'check'], false)
      .setIn(['register', 'message'], '')
      .setIn(['register', 'emailReInput'], '')
  },
  [INPUT]: (state, action) => {
    const { name, value } = action.payload
    return state.setIn(['register', name], value)
      .setIn(['register', 'message'], '')
  },
  [CHECK]: (state, action) => {
    return state.setIn(['register', 'check'], action.payload.checkData)
  },
  // 회원가입
  [REGISTER_LOADING]: (state, action) => {
    return state.setIn(['register', 'result'], 'loading')
  },
  [REGISTER_SUCCESS]: (state, action) => {
    return state.setIn(['register', 'message'], action.payload.data.message)
      .setIn(['register', 'result'], action.payload.data.success)
  }
}, initialState)