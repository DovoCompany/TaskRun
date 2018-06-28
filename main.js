let args = process.argv.slice(2);
module.exports = (function () {
  let promised = async function (func) {
    await func();
    return Promise.resolve();
  }
  let log = (...args) => console.log(args.join('') + colors.Reset);
  let colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
  };

  let fgColors = [
    "\x1b[31m",
    "\x1b[32m",
    "\x1b[33m",
    "\x1b[34m",
    "\x1b[35m",
    "\x1b[36m"
  ]

  let taskColors = {};
  let callAll = function (arr) {
    let newArr = [];
    for (let index in arr) {
      newArr[newArr.length] = arr[index]();
    }
    return newArr;
  }
  let callAllSync = async function (arr) {
    let newArr = [];
    for (let index = 0; index < arr.length; index++) {
      newArr[newArr.length] = await arr[index]();
    }
    return newArr;
  }
  let previousColor = null;
  let randomColor = () => {
    let color = null;
    while (color === null || previousColor === color) {
      color = fgColors[Math.floor(Math.random() * fgColors.length)];
    }
    previousColor = color;
    return previousColor;
  }
  let registry = {};
  let self = {
    register (method, ...args) {
      let methodName = method;
      if (typeof method === 'function' && method.name) {
        methodName = method.name;
        args = [promised(method), ...args];
      } else if (typeof method === 'function') {
        methodName = method();
      }
      taskColors[methodName] = [randomColor(), randomColor()];
      registry[methodName] = args;
    },
    parallel (...args) {
      args = Array.from(args);
      for (let index = 0; index < args.length; index++) {
        let arg = args[index];
        if (typeof args[index] === 'string') {
          let current = args[index];
          arg = () => self.execute(current);
        }
        args[index] = () => arg();
      }
      return () => Promise.all(callAll(args));
    },
    series (...args) {
      args = Array.from(args);
      for (let index = 0; index < args.length; index++) {
        let arg = args[index];
        if (typeof args[index] === 'string') {
          let current = args[index];
          arg = () => self.execute(current);
        }
        args[index] = () => arg();
      }
      return () => callAllSync(args);
    },
    async execute (_task) {
      log(taskColors[_task][0], 'Task started: ', taskColors[_task][1], _task);
      let task = registry[_task];
      let listening = [];
      for (let index = 0; index < task.length; index++) {
        listening[listening.length] = await task[index]();
      };
      await Promise.all(listening);
      return new Promise(resolve => { log(taskColors[_task][0], 'Task finished: ', taskColors[_task][1], _task); resolve(); });
    }
  };
  return self;
})()
