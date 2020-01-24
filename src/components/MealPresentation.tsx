import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Meal } from '../modules/meal';

const useStyles = makeStyles((theme: Theme) => createStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  titleText: {
    flexGrow: 1,
  },
  name: {
    marginBottom: theme.spacing(1),
  },
  fakeLi: {
    listStyle: 'none',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  diet: {
    width: 70,
  },
  dietList: {
    display: 'flex',
    flexDirection: 'row',
  },
  list: {
    marginBottom: theme.spacing(1),
  },
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

type MealPresentationProp = {
  meal?: Meal,
  single: boolean,
  waiting: boolean,
  error: string,
};

const LoadingMessage: React.FC = () => {
  const classes = useStyles();

  return (
    <CardContent className={classes.cardContent}>
      <Typography variant="h4">로딩 중</Typography>
    </CardContent>
  );
};

const ErrorMessage: React.SFC<{ error: string }> = (prop) => {
  const classes = useStyles();

  return (
    <CardContent className={classes.cardContent}>
      <Typography variant="h6">{prop.error}</Typography>
    </CardContent>
  );
};

const Title: React.SFC<{title: string,}> = (prop) => {
  const classes = useStyles();

  return (
    <CardContent className={classes.title}>
      <Typography className={classes.titleText} variant="h5">
        { prop.title }
      </Typography>
      { prop.children }
    </CardContent>
  );
};


export const MealPresentation: React.SFC<MealPresentationProp> = (prop) => {
  const classes = useStyles();

  const EmptyMessage: React.FC = () => (
    <CardContent className={classes.cardContent}>
      <Typography variant="h6">오늘 식단이 없습니다</Typography>
    </CardContent>
  );

  type DietListProp = {
    title: string,
    diet: string,
  };

  const DietList: React.SFC<DietListProp> = (prop) => (
    <CardContent className={classes.cardContent + ' ' + classes.diet}>
      <Typography className={classes.name} variant="h5">{prop.title}</Typography>
      { prop.diet.split('\n').map((e: string) => (
        <Typography className={classes.list} key={e}>
          {e.replace('&amp;', '&')}
        </Typography>
      )) }
    </CardContent>
  );

  return (
    <Card className={classes.card}>
      <Title title={
        prop.single ? '오늘의 식단' :
        prop.meal !== undefined ?
        prop.meal.day : ''
      }>
        { prop.single ? 
          <Button component={Link} to="/meal">일주일 학식</Button> : null }
      </Title>
      <Divider />
      { prop.error !== '' ?
          <ErrorMessage error={prop.error} />
        : prop.waiting ?
          <LoadingMessage />
        : prop.meal === undefined ?
          <EmptyMessage />
        : <div className={classes.dietList}>
            <DietList title="학식" diet={prop.meal.haksik} />
            <li className={classes.fakeLi}><Divider orientation="vertical" /></li>
            <DietList title="일품" diet={prop.meal.japan} />
            <li className={classes.fakeLi}><Divider orientation="vertical" /></li>
            <DietList title="석식" diet={prop.meal.dinner} />
          </div> }
    </Card>
  );
};

type MealFullPresentation = {
  weekMeal?: { [key: string]: Meal },
  error: string,
};

export const MealFullPresentation: React.SFC<MealFullPresentation> = (prop) => {
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      <Card className={classes.card}>
        { prop.weekMeal === undefined ?
          prop.error !== '' ?
            <ErrorMessage error={prop.error} />
          : <LoadingMessage />
          : <Title title="이번주 식단" /> }
      </Card>
      { prop.weekMeal !== undefined ?
          Object.keys(prop.weekMeal).map((day: string) => (
            <MealPresentation
              meal={prop.weekMeal !== undefined ?
                prop.weekMeal[day] : undefined}
            error=""
            waiting={false}
            single={false} 
            key={day} />
        ))
        : null }
    </div>
  );
};
