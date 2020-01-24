import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { RootState } from '../modules';
import { isLogin } from '../modules/login';
import { MealMini } from './Meal';

const useStyles = makeStyles((theme: Theme) => createStyles({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const login = useSelector((state: RootState) => state.login);

  return (
    <div className={classes.layout}>
      <Redirect to="/" />
      <Card>
        <CardContent>
          <Typography variant="h6">Hello, World!</Typography>
        </CardContent>
      </Card>
      { isLogin(login) ?
       (<Card>
          <CardContent>
            <Typography variant="h6">로그인 상태</Typography>
          </CardContent>
        </Card>) : null }
      <MealMini />
    </div>
  );
};

export default Home;
