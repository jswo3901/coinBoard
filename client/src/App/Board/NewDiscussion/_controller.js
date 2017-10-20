import { postDiscussionApi } from './api';

export const POSTING_DISCUSSION_START = 'POSTING_DISCUSSION_START';
export const POSTING_DISCUSSION_END = 'POSTING_DISCUSSION_END';
export const POSTING_DISCUSSION_SUCCESS = 'POSTING_DISCUSSION_SUCCESS';
export const POSTING_DISCUSSION_FAILURE = 'POSTING_DISCUSSION_FAILURE';

export const UPDATE_DISCUSSION_TITLE = 'UPDATE_DISCUSSION_TITLE';
export const UPDATE_DISCUSSION_CONTENT = 'UPDATE_DISCUSSION_CONTENT';

export const CLEAR_SUCCESS_MESSAGE = 'CLEAR_SUCCESS_MESSAGE';


export const postDiscussion = (userId, forumId, currentForum) => {
    return (dispatch, getState) => {
      dispatch({ type: POSTING_DISCUSSION_START });
  
      // validate discussion inputs
      // discussion values are in redux state
      const {
        title,
        content
      } = getState().newDiscussion;
  
      let validated = true;
      var userId = 'user111'
      var forumId = 'forum222'

      if (!userId || !forumId) {
        validated = false;
        return dispatch({
          type: POSTING_DISCUSSION_FAILURE,
          payload: 'Something is wrong with user/forum.',
        });
      }
  
      if (title === null || title.length < 15) {
        validated = false;
        return dispatch({
          type: POSTING_DISCUSSION_FAILURE,
          payload: 'Title should be at least 15 characters.',
        });
      }
  
      if (content === null || content.length === 0) {
        validated = false;
        return dispatch({
          type: POSTING_DISCUSSION_FAILURE,
          payload: 'Please write some content before posting.',
        });
      }
      
      // make api call if post is validated
      if (validated) {
        postDiscussionApi({
          userId,
          forumId,
          title,
          content
        }).then(
          (data) => {
            console.log(data)
            // if (data.data.postCreated === true) {
            //   dispatch({ type: POSTING_DISCUSSION_SUCCESS });
            //   setTimeout(() => { dispatch({ type: CLEAR_SUCCESS_MESSAGE }); }, 2000);
  
            //   // 리다이렉트 이자리에 걸기.
            // //   browserHistory.push(`/${currentForum}/discussion/${data.data.discussion_slug}`);
            // } else {
            //   dispatch({
            //     type: POSTING_DISCUSSION_FAILURE,
            //     payload: 'Something is wrong at our server end. Please try again later',
            //   });
            // }

          },
          (error) => {
            dispatch({
              type: POSTING_DISCUSSION_FAILURE,
              payload: error,
            });
          }
        );
      }
    };
  };

  export const updateDiscussionTitle = (value) => {
    return {
      type: UPDATE_DISCUSSION_TITLE,
      payload: value,
    };
  };

  export const updateDiscussionContent = (value) => {
    return {
      type: UPDATE_DISCUSSION_CONTENT,
      payload: value,
    };
  };

  // 여기부터 리듀서

  const initialState = {
    postingSuccess: false,
    errorMsg: null,
    postingDiscussion: false,
    title: '',
    content: null
  };

  export const newDiscussionReducer = (state = initialState, action) => {
    switch (action.type) {
      case POSTING_DISCUSSION_START:
        return Object.assign({}, state, {
          postingDiscussion: true,
        });
  
      case POSTING_DISCUSSION_SUCCESS:
        return Object.assign({}, initialState, {
          postingSuccess: true,
          postingDiscussion: false,
          errorMsg: null,
        });
  
      case POSTING_DISCUSSION_FAILURE:
        return Object.assign({}, state, {
          postingSuccess: false,
          postingDiscussion: false,
          errorMsg: action.payload || 'Unable to post discussion.',
        });
  
      case CLEAR_SUCCESS_MESSAGE:
        return Object.assign({}, initialState, {
          postingSuccess: false,
        });
  
      case UPDATE_DISCUSSION_TITLE:
        return Object.assign({}, state, {
          title: action.payload,
        });
  
      case UPDATE_DISCUSSION_CONTENT:
        return Object.assign({}, state, {
          content: action.payload,
        });
  
      default:
        return state;
    }
  };
  