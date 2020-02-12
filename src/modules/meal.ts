import { Dispatch } from 'redux';

import { forestAPI } from './apis';
import { DEBUG } from './config';

type MealUrl = {
  date: string,
  title: string,
  url: string,
};

type MealUrlRes = {
  urls: Array<MealUrl>,
};

type MealDataDiet = {
  calorie: string,
  diet: string,
};

type MealData = {
  date: string,
  day: string,
  lunch: { [key: string]: MealDataDiet },
  dinner: { [key: string]: MealDataDiet },
};

type MealDataRes = {
  data: Array<MealData>,
};

export type Meal = {
  date: string,
  day: string,
  haksik: string,
  japan: string,
  dinner: string,
};

const apiOption = {withCredentials: false};

const REQUEST = 'meal/REQUEST' as const;
const LOAD = 'meal/LOAD' as const;
const FAILED = 'meal/FAILED' as const;

const request = () => ({ type: REQUEST });
const load = (res: { [key: string]: Meal }) => ({ type: LOAD, payload: res});
const failed = (err: string) => ({ type: FAILED, payload: err});

type MealAction = 
  | ReturnType<typeof request>
  | ReturnType<typeof load>
  | ReturnType<typeof failed>;

type MealState = {
  waiting: boolean,
  meal?: { [key: string]: Meal },
  error: string,
};

const initialState: MealState = {
  waiting: false,
  meal: undefined,
  error: '',
};

function meal(state: MealState = initialState, action: MealAction) {
  switch (action.type) {
    case REQUEST:
      return { meal: undefined, waiting: true, error: '' };
    case LOAD:
      return { ...state, waiting: false, meal: action.payload };
    case FAILED:
      return { ...state, waiting: false, error: action.payload };
    default:
      return state;
  }
}

export function Request() {
  return async (dispatch: Dispatch<MealAction>) => {
    dispatch(request());

    try {
      const urlRes: MealUrlRes = (await forestAPI.get('/life/meal/urls', apiOption)).data;
      const urls: Array<MealUrl> = urlRes.urls;
      const searchDate = RegExp('(\\d+)/(\\d+)');

      const now = new Date();
      const nowMonth = now.getMonth() + 1;
      const nowDate = now.getDate();

      let nowMealUrl: string | undefined = undefined;
      urls.forEach((url: MealUrl) => {
        let parse = searchDate.exec(url.title);
        if (parse === null) {
          return;
        }
        const startMonth = parseInt(parse[1]);
        const startDate = parseInt(parse[2]);
        parse = searchDate.exec(url.title.slice(parse.index + parse[0].length));
        if (parse === null) {
          return;
        }
        const endMonth = parseInt(parse[1]);
        const endDate = parseInt(parse[2]);

        if ((startMonth === nowMonth || endMonth === nowMonth) &&
          (startDate <= nowDate && endDate >= nowDate)) {
          nowMealUrl = url.url;
        }
      });

      // 디버그 시 가장 최근 것으로 불러온다.
      if (nowMealUrl === undefined && !DEBUG) {
        dispatch(load({}));
        return;
      } else if (DEBUG) {
        nowMealUrl = urls[0].url;
      }

      const mealData: Array<MealData> = (await forestAPI.post('/life/meal/data', {
        url: nowMealUrl
      }, apiOption)).data.data;
      let result: { [key: string]: Meal } = {};
      for (let i = 0; i < mealData.length; i++) {
        const mData = mealData[i];
        result[mData.day] = {
          date: mData.date,
          day: mData.day,
          haksik: mData.lunch['a'].diet,
          japan: mData.lunch['b'].diet,
          dinner: mData.dinner['a'].diet,
        };
      }

      dispatch(load(result));
    } catch (e) {
      dispatch(failed(e.toString()));
    }
  };
}

export default meal;
