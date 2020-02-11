import axios from 'axios';

import { SKHUS_API, SAM_API } from './config';

export const forestAPI = axios.create({
  baseURL: SKHUS_API,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'text/plain',
  },
});

export const samAPI = axios.create({
  baseURL: SAM_API,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
