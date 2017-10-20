import React from 'react';
// Components
import Login from 'App/Login'

const SideBar = ({
  viewRegister, isLogin
}) => {
  return (
    <div>
      <Login
        isLogin={isLogin}
        viewRegister={viewRegister}
      />
    </div>
  );
};

export default SideBar;