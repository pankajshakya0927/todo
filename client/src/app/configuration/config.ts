import { environment } from 'src/environments/environment';

export let config = {
  apiBaseUrl: environment.apiBaseUrl,

  urls: {
    newTask: '/newTask'
  },
};
