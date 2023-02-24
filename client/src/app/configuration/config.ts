import { environment } from 'src/environments/environment';

export let config = {
  apiBaseUrl: environment.apiBaseUrl,

  urls: {
    getBoard: '/getBoard',
    updateBoard: '/updateBoard',

    getTasks: '/getTasks',
    newTask: '/newTask',
    newSubtask: '/newSubtask',
    isCompleteSubtask: '/isCompleteSubtask'
  },
};
