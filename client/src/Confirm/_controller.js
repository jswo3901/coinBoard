// Home CONTROLLER
import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import * as API from 'lib/api/auth'

// 액션 타입 정의
const CONFIRM = 'confirm/CONFIRM' // 회원가입
const CONFIRM_SUCCESS = 'confirm/CONFIRM_SUCCESS' 

// 액션 생성자
export const confirm = createAction(CONFIRM, API.confirmMailAPI)

const initialState = Map({
  confirm: Map({
    message:'',
    result:false
  }),
})

export default handleActions({
  [CONFIRM_SUCCESS]: (state, action) => {
    return state.setIn(['confirm', 'message'], action.payload.data.msg)
                .setIn(['confirm', 'result'], action.payload.data.result)
  }
}, initialState)


