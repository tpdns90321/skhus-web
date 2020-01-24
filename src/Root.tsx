import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import rootReducer from './modules';
import Routes from './Routes';
import Navigator from './components/Navigator';

const store = createStore(
  rootReducer,
  // Redux 디버거를 사용하기 위한 설정
  composeWithDevTools(applyMiddleware(thunk)),
);

const Root: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navigator />
        <Routes />
      </BrowserRouter>
    </Provider>);
};

export default Root;
