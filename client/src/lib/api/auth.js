import axios from 'axios';

// 회원가입
export const registerAPI = (email, password, nickname, passwordConfirm, check) => {
  return axios.post('/auth/register', { email: email, password: password, nickname:nickname, passwordConfirm: passwordConfirm, check:check })
}

// 로그인
export const loginAPI = (loginEmail, loginPassword) => {
  return axios.post('/auth/login', { loginEmail: loginEmail, loginPassword: loginPassword})
}

// 이메일 인증
export const confirmMailAPI = (token) => {
  return axios.get('/auth/confirm/'+token)
}

// 이메일 재인증
export const reConfirmAPI = (email) => {
  return axios.get('/auth/reconfirm/'+email)
}

// 로그인 상태 확인
export const isLoginAPI = (accessToken) => {
  return axios.get('/api/isLogin', {headers: {'Authorization': accessToken}})
}

// 토큰 리프레쉬
export const refreshAccessAPI = (refreshToken) => {
  return axios.get('/auth/refresh', {headers: {'Authorization': refreshToken}})
}