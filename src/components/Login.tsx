import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import LockIcon from '@material-ui/icons/Lock';

import { RootState } from '../modules';
import { idUpdate, pwUpdate, Request, errorConfirm } from '../modules/login';
import Message from './Message';

const useStyles = makeStyles((theme: Theme) => createStyles({
  layout: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '75vh',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  title: {
    fontSize: 30,
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(1),
  },
  resize: {
    fontSize: 18,
  },
  iconButton: {
    fontSize: 40,
  },
}));

const Login: React.FC = () => {
  const classes = useStyles();
  const login = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();

  const update = (target: 'id' | 'pw') => {
    switch (target) {
      case 'id':
        return (e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch(idUpdate(e.target.value));
        };
      case 'pw':
        return (e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch(pwUpdate(e.target.value));
        };
    }
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(Request());
  }

  return (
    <div className={classes.layout}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>Login</Typography>
        </CardContent>
        <CardContent>
          <form
            className={classes.form}
            onSubmit={submit}>
            <div className={classes.input}>
              <TextField
                type="text"
                inputProps={{
                  autoCorrect: "off",
                  autoCapitalize: "off",
                  className: classes.resize,
                }}
                placeholder="ID"
                className={classes.textField}
                value={login.id}
                onChange={update('id')}
                disabled={login.waiting}
              />
              <TextField
                type="password"
                inputProps={{
                  autoCorrect: "off",
                  autoCapitalize: "off",
                  className: classes.resize,
                }}
                placeholder="PW"
                className={classes.textField}
                value={login.pw}
                onChange={update('pw')}
                disabled={login.waiting}
              />
            </div>
            <IconButton
              type="submit"
              disabled={login.waiting}>
              <LockIcon className={classes.iconButton} />
            </IconButton>
          </form>
        </CardContent>
        <Message
          open={login.error !== ''}
          title="로그인 오류"
          content={login.error}
          onConfirm={(_:any) => {
            dispatch(errorConfirm());
          }} />
      </Card>
    </div>
  );
};

export default Login;
