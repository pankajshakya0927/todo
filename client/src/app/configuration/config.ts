import { environment } from 'src/environments/environment';

export let config = {
  apiBaseUrl: environment.apiBaseUrl,

  urls: {
    getBoard: '/getBoard',
    updateBoard: '/updateBoard',

    getTasks: '/getTasks',
    newTask: '/newTask',
    updateTask: '/updateTask',
    deleteTask: '/deleteTask',

    newSubtask: '/newSubtask',
    updateSubtask: '/updateSubtask',
    deleteSubtask: '/deleteSubtask'
  },
};
