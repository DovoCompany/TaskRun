let args = process.argv.slice(2);
module.exports = (function() {
    let promised = async function(func) {
        await func();
        return Promise.resolve();
    }
    let callall = function (arr) {
        let newArr = [];
        for(let index in arr) {
            newArr[newArr.length] = arr[index]();
        }
        return newArr;
    }
    let callallsync = async function (arr) {
        let newArr = [];
        for(let index in arr) {
            newArr[newArr.length] = await arr[index]();
        }
        return newArr;
    }
    let registry = {};
    let self = {
        register(method, ...args) {
            let methodName = method;
            if (typeof method === 'function' && method.name) {
                methodName = method.name;
                args = [promised(method), ...args];
            } else if (typeof method === 'function') {
                methodName = method();
            }
            registry[methodName] = args;
        },
        parallel(...args) {
            args = Array.from(args);
            for (let index in args) {
                let arg = args[index];
                if (typeof args[index] === 'string') {
                    let current = args[index];
                    arg = ((current) => {return async () => {
                        return await self.execute(current);
                    }})(current);
                }
                args[index] = async () => await arg();
            }
            return async() => await Promise.all(callall(args));
        },
        series(...args) {
            args = Array.from(args);
            for (let index in args) {
                let arg = args[index];
                if (typeof args[index] === 'string') {
                    let current = args[index];
                    arg = ((current) => {return async () => {
                        return await self.execute(current);
                    }})(current);
                }
                args[index] = () => arg();
            }
            return async() => await callallsync(args);
        },
        async execute(task) {
            task = registry[task];
            let listening = [];
            for (let index in task) {
                listening[listening.length] = await task[index]();
            };
            return await Promise.all(listening);
        }
    };
    return self;
})()