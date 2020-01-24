import React from 'react';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import { Logout } from '../modules/login';

const LogoutComponent: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(Logout());

  return (<Typography variant="h6">로그아웃 중</Typography>);
};

export default LogoutComponent;
