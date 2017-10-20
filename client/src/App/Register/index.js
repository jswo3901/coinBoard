import React, { Component } from 'react';
import { Button, Checkbox, Form, Loader, Dimmer } from 'semantic-ui-react'
import style from './_style.css'
// REDUX
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appRegisterActions from './_controller'

// 성공시 화면
const RegisterSuccess = ( { message }) => {
  
  const redirectHome = () => (
    window.location.href = '/'
  )

  return (
    <div>
      <h1>
        {message}로 가입 인증메일이 발송되었습니다.
      </h1>

        <Button type='submit'>이메일 재인증 받기</Button>

        <Button onClick={redirectHome}>메인 화면으로 이동</Button>

      <h3>
        2시간 이내 인증메일을 확인해 주세요.
        <br />
        <br />
        인증에 실패했을 경우 ID/비밀번호찾기 > Email 재인증받기(링크처리하기)에서 다시 인증메일을 받으실 수 있습니다.
        <br />
        <br />
        인증하지 않은 메일 주소로는 60일 이내 재가입이 불가능합니다.
      </h3>
    </div>
  );
};

// 유효성 검사 컴포넌트
const ValidationMessage = ({ validatedName, validatedValue, compareValue }) => {
  const messages = {
    email: {
      empty: '이메일을 입력해 주세요',
      success: '환영합니다',
      fail: '이메일 양식이 올바르지 않습니다'
    },
    password: {
      empty: '특수문자나 숫자 1개 이상을 포함한 6~20자 비밀번호를 입력해주세요',
      success: '비밀번호가 일치합니다',
      fail: '비밀번호가 일치하지 않습니다'
    },
    nickname: {
      empty: '닉네임을 입력해주세요 (한글-영문 4~8자 / 특수문자 불가 / 중복가능)',
      success: '좋은 닉네임이네요!',
      fail: '올바르지 않은 닉네임 양식입니다 (한글-영문 4~8자 / 특수문자 불가)'
    },
    checkbox: {
      success: '감사합니다',
      fail: '약관에 동의해 주세요'
    },
  }

  const validationFunction = (condition1, condition2, return1, return2, return3) => {
    return condition1 ? return1 : condition2 ? return2 : return3
  }

  let validateMessages;

  let successMessage = (validatedName, result) => {
    const msg = messages[validatedName][result]
    return <p className={style.registerMessageSuccess}>{msg}</p>
  }

  let failMessage = (validatedName, result) => {
    const msg = messages[validatedName][result]
    return <p className={style.registerMessageFail}>{msg}</p>
  }

  switch (validatedName) {
    case 'email':
      const emailValidate = /^[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(validatedValue)
      validateMessages =
      validationFunction(
        emailValidate,
        validatedValue === '',
        successMessage(validatedName, 'success'),
        failMessage(validatedName, 'empty'),
        failMessage(validatedName, 'fail')
      )
      break;

    case 'password':
      const passwordValidate = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(validatedValue)
      validateMessages =
      validationFunction(
        !passwordValidate,
        validatedValue === compareValue,
        failMessage(validatedName, 'empty'),
        successMessage(validatedName, 'success'),
        failMessage(validatedName, 'fail')
      )
      break;

    case 'nickname':
      const nicknameValidate = /^[a-z0-9A-Z가-힣]{4,8}$/.test(validatedValue)
      validateMessages =
      validationFunction(
        nicknameValidate,
        validatedValue === '',
        successMessage(validatedName, 'success'),
        failMessage(validatedName, 'empty'),
        failMessage(validatedName, 'fail')
      )
      break;

    case 'checkbox':
      validateMessages =
        validatedValue ?
          successMessage(validatedName, 'success')
          : failMessage(validatedName, 'fail')
      break;

    default:
  }
  return (
    validateMessages
  )
};

// Present Part
const RegisterForm = ({
  appRegisterActions, email, password, passwordConfirm, nickname, check, message, emailReInput, reConfirmMessage
}) => {

  // 회원가입 입력
  const input = (e) => {
    const { name, value } = e.target
    appRegisterActions.input({ name, value })
  }

  // 체크박스
  const changeCheck = (handler, data) => {
    const checkData = data.checked
    appRegisterActions.check({ checkData })
  }

  // 제출
  const register = (e) => {
    e.preventDefault()
    appRegisterActions.register(email, password, nickname, passwordConfirm, check)
  }

  // 재인증
  const reconfirm = (e) => {
    e.preventDefault()
    appRegisterActions.reConfirm(emailReInput)
    .then((response) => {
      console.log(response)   
    })
  }

  return (
    <div>
    <Form onSubmit={register}>
      <Form.Field>
        <label>E-mail</label>
        <input id={style.registerInput} onChange={input} name='email' placeholder='E-mail' />
        <ValidationMessage validatedName='email' validatedValue={email} />
      </Form.Field>
      <Form.Field>
        <label>비밀번호</label>
        <input id={style.registerInput} onChange={input} name='password' type="password" placeholder='비밀번호' />
        <ValidationMessage validatedName='password' validatedValue={password} compareValue={passwordConfirm} />
      </Form.Field>
      <Form.Field>
        <label>비밀번호 확인</label>
        <input id={style.registerInput} onChange={input} name='passwordConfirm' type="password" placeholder='비밀번호 확인' />
        <ValidationMessage validatedName='password' validatedValue={password} compareValue={passwordConfirm} />
      </Form.Field>
      <Form.Field>
        <label>닉네임</label>
        <input id={style.registerInput} onChange={input} name='nickname' placeholder='닉네임' />
        <ValidationMessage validatedName='nickname' validatedValue={nickname} />
      </Form.Field>
      <Form.Field>
        <Checkbox onClick={changeCheck} label='모든 이용약관에 동의합니다' />
        <ValidationMessage validatedName='checkbox' validatedValue={check} />
      </Form.Field>
      <Button type='submit'>회원가입</Button>
        <p className={style.registerMessageFail}>{message}</p>
    </Form>
    <Form onSubmit={reconfirm}>
    <Form.Field>
      <label>이메일 재인증</label>
      <input id={style.registerInput} onChange={input} name='emailReInput' placeholder='이메일을 입력해 주세요' />
      <Button type='submit'>이메일 다시 받기</Button>
      {reConfirmMessage}
    </Form.Field>
    </Form>
    </div>
  );
};

class Register extends Component {
  render() {
    return (
      <div>        
        
        { this.props.result === 'loading' && 
          <Dimmer id={style.loading} active> 
            <Loader>회원 정보 생성 중</Loader>
          </Dimmer>
          }
        { this.props.result === true && <RegisterSuccess message = {this.props.message} />}
        { !this.props.result &&
          <RegisterForm
            appRegisterActions = {this.props.appRegisterActions}
            email = {this.props.email}
            password = {this.props.password}
            passwordConfirm = {this.props.passwordConfirm}
            nickname = {this.props.nickname}
            check = {this.props.check}
            message = {this.props.message}
            emailReInput = {this.props.emailReInput}
            reConfirmMessage = {this.props.reConfirmMessage}
          />
        }
      </div>
    );
  }
}

export default connect(
  (state) => ({
    email: state.appRegister.getIn(['register', 'email']),
    password: state.appRegister.getIn(['register', 'password']),
    passwordConfirm: state.appRegister.getIn(['register', 'passwordConfirm']),
    nickname: state.appRegister.getIn(['register', 'nickname']),
    check: state.appRegister.getIn(['register', 'check']),
    message: state.appRegister.getIn(['register', 'message']),
    result: state.appRegister.getIn(['register', 'result']),
    emailReInput: state.appRegister.getIn(['register', 'emailReInput']),
    reConfirmMessage: state.appRegister.getIn(['register', 'reConfirmMessage'])
}),
  (dispatch) => ({
  appRegisterActions: bindActionCreators(appRegisterActions, dispatch)
})

)(Register)