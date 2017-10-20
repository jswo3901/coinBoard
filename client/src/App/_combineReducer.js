import { combineReducers } from 'redux';

import appRegister from './Register/_controller'
import appLogin from './Login/_controller'
import confirm from 'Confirm/_controller'
import { newDiscussionReducer } from './Board/NewDiscussion/_controller'
import { appReducer, userReducer } from './Board/BoardApp/_controller'

export default combineReducers({
  user: userReducer,
  app: appReducer,
  appRegister,
  appLogin,
  confirm,
  newDiscussion: newDiscussionReducer
  //이렇게 하면 리덕스 툴에서 보이는 state이름 바뀜
});