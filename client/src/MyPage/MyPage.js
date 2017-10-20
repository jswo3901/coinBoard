import React from 'react';
import * as userActions from './_controller'
import { Button, Checkbox, Form, Grid, Card } from 'semantic-ui-react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


export const MyPage = ({
    email ,password , onSubmit , userActions
}) => {
    const onChange =(e) => {
        const { name, value } = e.target
        userActions.input({ name, value })
    }

    return (
    <div>
        <Card.Content>
        <Form onSubmit={onSubmit}>
            <Form.Field>
            <label>E-mail</label>
            <input name="email" onChange={onChange} value={email} placeholder='E-mail' />
            </Form.Field>
            <Form.Field>
            <label>비밀번호</label>
            <input name="password" onChange={onChange} value={password} placeholder='비밀번호' />
            </Form.Field>
            <Button type='submit'>
            로그인
            </Button>
        </Form>
        </Card.Content>
    </div>
    )
}



export default connect(
    (state) => ({
      view: state.user.getIn(['mylogin', 'view']),
      email: state.user.getIn(['mylogin', 'email']),
      password: state.user.getIn(['mylogin', 'password']),
    }),
  
    (dispatch) => ({
      userActions: bindActionCreators(userActions, dispatch)
    })
  
  )(MyPage);