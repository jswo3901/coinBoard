import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react'
import style from './_style.css'
// App Components
import Title from './Title'
import Nav from './Nav'
import MenuBar from './MenuBar'
import Footer from './Footer'
import Main from './Main'
import SideBar from './SideBar'
// REDUX
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appRegisterActions from './Register/_controller'
import * as appLoginActions from './Login/_controller'
// Cookies
import Cookies from 'universal-cookie'

// Present Part
class App extends Component {

  componentWillMount() {
    const cookies = new Cookies()
    this.props.appActions.isLogin(cookies.get('accessToken'))
    .then((response) => {
      response.value.data.result === true && this.viewIsLogin()
      response.value.data.result === 'needRefresh' && this.props.appActions.refreshAccess(cookies.get('refreshToken')).then((response) => {
        cookies.set('accessToken', response.value.data.accessToken)
      })
    })
  }
  
  state = {
    view: '',

    viewRegister: false,
    isLogin: false,
  }

  viewMenu = (name) => {
    this.setState({view: name})
  }

  viewRegister = () => {
    this.props.appActions.cleanState()
    this.setState({
      view: '',
      viewRegister: !this.state.viewRegister
    })
  }

  viewIsLogin = () => {
    this.props.appActions.cleanState()
    this.setState({
      isLogin: true
    })
  }

  render() {
    return (
      <Grid columns='equal'>
        <Grid.Column id={style.ad1} width={1}>광고</Grid.Column>
        <Grid.Column id={style.application} width={13}>
          <Grid.Row>
            <Title />
          </Grid.Row>
            <Nav
              isLogin = {this.state.isLogin}
            />
            <MenuBar
              viewMenu = {this.viewMenu}
            />
          <Grid columns='equal'>
            <Grid.Column id={style.sideBar} width={3}>
              <SideBar
                isLogin = {this.state.isLogin}
                viewRegister={this.viewRegister}
              />
            </Grid.Column>
            <Grid.Column id={style.main}>
              <Main
                viewMenu={this.state.view}
                viewRegister={this.state.viewRegister}
              />
            </Grid.Column>
          </Grid>
          <Grid columns='equal'>
            <Grid.Column id={style.footer}>
              <Footer />
            </Grid.Column>
          </Grid>
        </Grid.Column>
        <Grid.Column id={style.ad2}>광고2</Grid.Column>
      </Grid>
    );
  }
}

// Container Part
export default connect(
  (state) => ({
    result: state.appRegister.getIn(['register', 'result']),
  }),

  (dispatch) => ({
    appActions: bindActionCreators({ ...appRegisterActions, ...appLoginActions }, dispatch)
  })

)(App)