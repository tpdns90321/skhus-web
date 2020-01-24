import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import HomeIcon from '@material-ui/icons/Home';

import { RootState } from '../modules';
import { isLogin } from '../modules/login';
import { invisible } from '../modules/drawer';

const useStyles = makeStyles((theme: Theme) => createStyles({
  list: {
    width: 250,
  },
}));

const NavigationBar: React.FC = () => {
  const classes = useStyles();
  const drawer = useSelector((state: RootState) => state.drawer);
  const login = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();

  const onInvisible = (_:any) => {
    dispatch(invisible());
  };

  const HomeItem: React.FC = () => (
    <ListItem button key="home" component={Link} to ="/">
      <ListItemIcon><HomeIcon /></ListItemIcon>
      <ListItemText>홈</ListItemText>
    </ListItem>
  );

  const LoginItem: React.FC = () => (
    <ListItem button key="login" component={Link} to="/login">
      <ListItemIcon><LockIcon /></ListItemIcon>
      <ListItemText>로그인</ListItemText>
    </ListItem>
  );

  const LoginOutItem: React.FC = () => (
    <ListItem button key="logout" component={Link} to="/logout">
      <ListItemIcon><LockOpenIcon /></ListItemIcon>
      <ListItemText>로그아웃</ListItemText>
    </ListItem>
  );

  return (
    <Drawer open={drawer.visible} onClose={onInvisible}>
      <div
        className={classes.list}
        role="presentation"
        onClick={onInvisible}
      >
        <List>
          <HomeItem />
          { isLogin(login) ? <LoginOutItem /> : <LoginItem /> }
        </List>
      </div>
    </Drawer>);
};

export default NavigationBar;
