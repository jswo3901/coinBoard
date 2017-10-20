import React from 'react'
import { List } from 'semantic-ui-react'
// Local Store
import Cookies from 'universal-cookie'

const Nav = ({isLogin}) => {
  
  const logout = () => {
    const cookies = new Cookies()
    cookies.remove('accessToken')
    cookies.remove('refreshToken')
    window.location.href='/'
  }
  
  return (
    <List floated='right' bulleted horizontal>
      {(!isLogin) && <List.Item as='a'>로그인</List.Item> }
      {isLogin && <List.Item as='a' onClick={logout}> 로그아웃</List.Item> }
    </List>
  );
};

export default Nav;