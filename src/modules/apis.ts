import axios from 'axios';

import { SKHUS_API, SAM_API } from './config';

export const forestAPI = axios.create({
  baseURL: SKHUS_API,
  timeout: 30000,
  withCredentials: true,
});

export const samAPI = axios.create({
  baseURL: SAM_API,
  timeout: 30000,
});
