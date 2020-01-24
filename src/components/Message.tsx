import React from 'react';

import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  Modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Card: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  Confirm: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  TitleText: {
    fontWeight: 'bold',
  },
  ConfirmText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}));

type MessageProp = {
  open: boolean,
  title: string,
  content: string,
  onConfirm: (_: any) => void,
}

const Message: React.SFC<MessageProp> = (prop) => {
  const classes = useStyles();

  return (
    <Modal open={prop.open} className={classes.Modal}>
      <Card className={classes.Card}>
        <CardContent>
          <Typography variant="h6">{prop.title}</Typography>
        </CardContent>
        <CardContent>
          { prop.content.split("\n")
                        .map((e: string) =>
                          (<Typography variant="caption" key={e}>{e}<br /></Typography>)) }
        </CardContent>
        <CardContent className={classes.Confirm}>
          { prop.children }
          <Typography
            variant="button"
            onClick={prop.onConfirm}
            color="primary"
            className={classes.ConfirmText}>
            확인
          </Typography>
        </CardContent>
      </Card>
    </Modal>
  )
};

export default Message;
