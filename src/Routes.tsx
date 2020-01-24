import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import { RootState } from './modules';
import { isLogin } from './modules/login';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Meal from './components/Meal';

const Routes: React.FC = () => {
  const login = useSelector((state: RootState) => state.login);

  return (
    <Switch>
      {!isLogin(login) ?
        <Route path="/login" component={Login} /> :
        <Route path="/logout" component={Logout} />}
      <Route path="/meal" component={Meal} />
      <Route path="/" component={Home} />
      <Redirect path="*" to="/" />
    </Switch>);
};

export default Routes;
