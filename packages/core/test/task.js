const taskrun = require('../main');
taskrun.register('task1', async () => {
    await new Promise(resolve => setTimeout(() =>
    {console.log('demo 1'); resolve();}, 16));
});
taskrun.register('task3', async () => {
  await new Promise(resolve => setTimeout(() =>
  {console.log('demo 3 / 1'); resolve();}, 16));
  await new Promise(resolve => setTimeout(() =>
  {console.log('demo 3 / 2'); resolve();}, 16));
});

taskrun.register('task2', () => {
    console.log('demo 2');
}, taskrun.parallel('task1', 'task3'), taskrun.series('task1', 'task3'), taskrun.parallel('task1', 'task3'));

taskrun.execute('task2');
