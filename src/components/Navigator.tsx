import React from 'react';
import { useDispatch } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import MenuIcon from '@material-ui/icons/Menu';

import { visible } from '../modules/drawer';
import NavigationBar from './NavigationBar';

const useStyles = makeStyles((theme: Theme) => createStyles({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    textDecoration: 'none',
    color: 'white',
    flexGrow: 1,
  },
}));

const Navigator: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const onVisible = (_: any) => {
    dispatch(visible());
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          edge="start"
          onClick={onVisible}
          className={classes.menuButton}
          color="inherit">
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          className={classes.title}
          to="/">
          {"SKHU's"}
        </Typography>
      </Toolbar>
      <NavigationBar />
    </AppBar>);
};

export default Navigator;
