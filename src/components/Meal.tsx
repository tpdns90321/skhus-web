import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../modules';
import { Meal, Request } from '../modules/meal';
import { DayToKoreanDay } from '../utils/day';
import { MealPresentation, MealFullPresentation } from './MealPresentation';

export const MealMini: React.FC = () => {
  const meal = useSelector((state: RootState) => state.meal);
  const dispatch = useDispatch();

  if (meal.error === '' && meal.meal === undefined && !meal.waiting)
    dispatch(Request());

  let targetMeal: Meal | undefined = undefined;
  if (meal.error === '' && meal.meal !== undefined) {
    const today = new Date();
    targetMeal = meal.meal[DayToKoreanDay[today.getDay()]];
  }

  return (
    <MealPresentation
      single={true}
      waiting={meal.waiting}
      meal={targetMeal}
      error={meal.error} />
  );
};

const MealFull: React.FC = () => {
  const meal = useSelector((state: RootState) => state.meal);
  const dispatch = useDispatch();

  if (meal.error === '' && meal.meal === undefined && !meal.waiting)
    dispatch(Request());

  return (
    <MealFullPresentation weekMeal={meal.meal} error={meal.error} />
  );
};

export default MealFull;
