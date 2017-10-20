import React from 'react'
import Routes from './App/Routes'
// 리덕스
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import reducers from './App/_combineReducer';

const customizedPromiseMiddleware = promiseMiddleware({
  promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'FAIL']
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(
  applyMiddleware(ReduxThunk, customizedPromiseMiddleware)
));

const Root = () => (
  <Provider store={store}>
      <Routes />
  </Provider>
)

export default Root