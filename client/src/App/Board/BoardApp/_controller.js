import _ from 'lodash';
import {
    fetchForums,
    fetchUser
} from './api'

export const UPDATECURRENTFORUM = 'UPDATE_CURRENT_FORUM';

export const START_FETCHING_FORUMS = 'START_FETCHING_FORUMS';
export const STOP_FETCHING_FORUMS = 'STOP_FETCHING_FORUMS';
export const FETCHING_FORUMS_SUCCESS = 'FETCHING_FORUMS_SUCCESS';
export const FETCHING_FORUMS_FAILURE = 'FETCHING_FORUMS_FAILURE';

export const START_FETCHING_USER = 'START_FETCHING_USER';
export const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS';
export const FETCHING_USER_FAILURE = 'FETCHING_USER_FAILURE';

// 모든 게시판 리스트 불러온다. action을 리턴

export const getForums = () => {
    return (dispatch, getState) => {
        dispatch({ type: START_FETCHING_FORUMS })

        fetchForums().then(
            data => dispatch({ type: FETCHING_FORUMS_SUCCESS, payload: data.data }),
            error => dispatch({ type: FETCHING_FORUMS_FAILURE })
        )
    }
}

// route가 변하면 현재 포럼 업데이트. currentForum(파라미터,payload) 문자열 return 액션

export const updateCurrentForum = (currentForum) => {
    return {
        type: UPDATECURRENTFORUM,
        payload: currentForum
    }
}

// 현재 유저를 서버로부터 가져온다. action 리턴

export const getUser = () => {
    return (dispatch, getState) => {
        dispatch({ type: START_FETCHING_USER })

        fetchUser().then(
            data => {
                if (!data.data._id) dispatch({ type: FETCHING_USER_FAILURE })
                else dispatch({ type: FETCHING_USER_SUCCESS, payload: data.data })
            },
            error => dispatch({ type: FETCHING_USER_FAILURE })
        )
    }
}

const initialState = {
    fetchingForums: false,
    forums: null,
    currentForum: 'general',
    error: false
}

// top레벨 앱의 state 

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_FETCHING_FORUMS:
            return Object.assign({}, state, {
                fetchingForums: true
            })

        case STOP_FETCHING_FORUMS:
            return Object.assign({}, state, {
                fetchingForums: false
            })

        case FETCHING_FORUMS_SUCCESS:
            return Object.assign({}, state, {
                forums: action.payload,
                fetchingForums: false,
                error: false
            })

        case FETCHING_FORUMS_FAILURE:
            return Object.assign({}, state, {
                fetchingForums: false,
                error: '포럼 가져오기 실패'
            })

        case UPDATECURRENTFORUM:
            return Object.assign({}, state, {
                currentForum: action.payload
            })

        default:
            return state
    }
}

// 유저용 리듀서

const initialUserState = {
    fetchingUser: true,
    authenticated: false,
    error: null,
    _id: null,
    name: null,
    email: null,
    username: null,
    avatarUrl: null,
    githubUrl: null,
    githubLocation: null,
    githubBio: null,
    role: null
}

export const userReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case START_FETCHING_USER:
            return Object.assign({}, state, {
                fetchUser: true
            })

        case FETCHING_USER_SUCCESS:
            const {
                _id,
                name,
                username,
                avatarUrl,
                email,
                githubBio,
                githubUrl,
                githubLocation,
                role
            } = action.payload

            return Object.assign({}, state), {
                fetchingUser: false,
                authenticated: true,
                error: null,
                _id,
                name,
                username,
                avatarUrl,
                email,
                githubBio,
                githubUrl,
                githubLocation,
                role
            }

        case FETCHING_USER_FAILURE:
            return Object.assign({}, initialUserState, {
                fetchingUser: false,
                error: '유저정보 가져오기 실패'
            })

        default:
            return state
    }
}