import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react'
// REDUX
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as confirmActions from './_controller'

class Confirm extends Component {

  componentDidMount() {
    this.props.confirmActions.confirm(this.props.match.params.token)
  }

  home = () => {
    window.location.href = '/'
  }

  render() {
    const { message } = this.props
    return (
      <Card>
        <Card.Content>
          <Card.Header>
         </Card.Header>
          <Card.Meta>
            <h1>{message}</h1>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Button onClick={this.home}>홈으로</Button>
          <Button>이메일 다시 인증 받기</Button>
        </Card.Content>
      </Card>
    );
  }
}

// Container Part
export default connect(
  (state) => ({
    message: state.confirm.getIn(['confirm', 'message']),
  }),
  (dispatch) => ({
    confirmActions: bindActionCreators(confirmActions, dispatch)
  })

)(Confirm)