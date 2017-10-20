import React from 'react';
import { Header } from 'semantic-ui-react'
import style from './_style.css'

const Title = () => {
  const onClickHeaderTitle = () =>{
    window.location.href = "/"
  }

  return (
    <Header id={style.title} size='huge' as='h1' name='home' onClick={onClickHeaderTitle} content='Coin Community' />
  );
};

export default Title;