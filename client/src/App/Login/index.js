import React, { Component } from 'react';
import { Button, Card, Form } from 'semantic-ui-react'
import style from './_style.css'
// REDUX
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appLoginActions from './_controller'
// Cookies
import Cookies from 'universal-cookie'

// Present Part
const UserBox = () => {
  
  const logout = () => {
    const cookies = new Cookies()
    cookies.remove('accessToken')
    cookies.remove('refreshToken')
    window.location.href='/'
  }

  return (
    <Card>
    환영합니다
      <Card.Content>
      <Card.Header>
        닉네임
      </Card.Header>
      {/* <Card.Meta>
        <span className='date'>
          자잘한 정보.. 등급이라던지
        </span>
      </Card.Meta>
      <Card.Description>
        현황같은거..
      </Card.Description> */}
      </Card.Content>
    <Card.Content extra>
      <Button basic onClick={logout} color='black'>
        로그아웃
      </Button>
    </Card.Content>
  </Card>
  );
};

const LoginButton = ({
  viewInput
}) => {
  return (
    <Card.Content>
    <Card.Description>
      로그인 후 다양한 서비스를 이용해 보세요!
    </Card.Description>
    <div id={style.loginButton} className='ui two buttons'>
      <Button basic color='orange' onClick={viewInput}>
        로컬 로그인
      </Button>
    </div>
    <div id={style.loginButton} className='ui two buttons'>
      <Button basic color='green'>
        소셜 로그인
      </Button>
    </div>
    </Card.Content>
  );
};

const LoginInput = ({
  appLoginActions, loginEmail, loginPassword, message,
}) => {

  // 로그인 입력
  const input = (e) => {
    const { name, value } = e.target
    appLoginActions.input({ name, value })
  }

  const cookies = new Cookies()

  // login 폼 제출
  const loginSubmit = (e) => {
    e.preventDefault()
    loginEmail === '' || loginPassword === '' ?
    appLoginActions.loginValidation()
    : appLoginActions.login(loginEmail, loginPassword)
      .then((response) => {
        cookies.set('accessToken', response.value.data.token.accessToken)
        cookies.set('refreshToken', response.value.data.token.refreshToken)
      })
      .then((response) => {
          window.location.href = '/'
      })
  }

  return (
    <Card.Content>
      <Form onSubmit={loginSubmit}>
      <Form.Field>
        <label>E-mail</label>
        <input name="loginEmail" placeholder='E-mail' onChange={input} />
      </Form.Field>
      <Form.Field>
        <label>비밀번호</label>
        <input name="loginPassword" type="password" placeholder='비밀번호' onChange={input} />
      </Form.Field>
      <Button type='submit'>
        로그인
      </Button>
      <p className={style.loginMessageFail}>{message}</p>
      </Form>
    </Card.Content>
  );
};

class LoginBox extends Component {
  state = {
    viewInput: false,
  }

  viewInput = () => {
    this.setState({ 
      viewInput: true
    })
  }

  render() {
    const { viewInput } = this
    const { viewRegister } = this.props

    return (
      <Card>
        {!this.state.viewInput && <LoginButton viewInput={viewInput} />}
        {this.state.viewInput && 
          <LoginInput 
            appLoginActions={this.props.appLoginActions}
            message={this.props.message}
            loginEmail={this.props.loginEmail}
            loginPassword={this.props.loginPassword}
          />}
        <Card.Content extra>
        <div className='ui two buttons'>
        <Button basic color='blue' onClick={viewRegister}>
          회원가입
        </Button>
        <Button basic color='blue'>
          ID/비번찾기
        </Button>
        </div>
        </Card.Content>
      </Card>
    )
  }
}


class Login extends Component {
  render() {
    const isLogin = this.props.isLogin
    return (
      <div>
      {(!isLogin) && <LoginBox
        loginEmail = {this.props.loginEmail}
        loginPassword = {this.props.loginPassword}
        message = {this.props.message}
        viewRegister = {this.props.viewRegister}
        appLoginActions = {this.props.appLoginActions}
      />}
      {isLogin && <UserBox
      />}
    </div>
    );
  }
}

// Container Part
export default connect(
  (state) => ({
    loginEmail: state.appLogin.getIn(['login', 'loginEmail']),
    loginPassword: state.appLogin.getIn(['login', 'loginPassword']),
    message: state.appLogin.getIn(['login', 'message']),
}),
  (dispatch) => ({
  appLoginActions: bindActionCreators(appLoginActions, dispatch)
})

)(Login)