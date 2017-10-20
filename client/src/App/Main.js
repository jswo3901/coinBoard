import React from 'react';
// Components
import Register from 'App/Register'
import Home from 'App/Home'
import Price from 'App/Price'
import Chat from 'App/Chat'
import Board from 'App/Board/NewDiscussion'
import Item from 'App/Item'
import Mypage from 'App/Mypage'
import Customer from 'App/Customer'

// Present Part
const Main = ({
  viewRegister, viewMenu
}) => {
  return (
    <div>
      { viewRegister && <Register /> }
      { viewMenu === 'home' && <Home /> }
      { viewMenu === 'price' && <Price /> }
      { viewMenu === 'chat' && <Chat /> }
      { viewMenu === 'board' && <Board /> }
      { viewMenu === 'item' && <Item /> }
      { viewMenu === 'mypage' && <Mypage /> }
      { viewMenu === 'customer' && <Customer /> }
    </div>
  );
};

// Container Part
export default Main