import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

const INPUT = 'mypage/INPUT' 

export const input = createAction(INPUT) // name, value

const initialState = Map({
    mylogin: Map({
        view: false,
        email: '',
        password: ''
    })
})

export default handleActions({
    [INPUT]: (state, action) => {
        const { name, value } = action.payload
        return state.setIn(['login', name], value)
                    .setIn(['register',name], value)
    }
}, initialState);