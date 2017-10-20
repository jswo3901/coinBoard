import axios from 'axios';

export const postDiscussionApi = (discussion) => {
  return axios.post('/api/discussion/newDiscussion', discussion);
};
// 나중에 옮기기
