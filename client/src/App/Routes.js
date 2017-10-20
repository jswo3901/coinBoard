import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App'
import NotFound from './NotFound'
// Components
import Confirm from 'Confirm'

const Routes = () => {
  return (
    <BrowserRouter>
    <div>
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/confirm/:token' component={Confirm} />
        <Route component={NotFound} />
      </Switch>
    </div>
    </BrowserRouter> 
    
  );
};

export default Routes;