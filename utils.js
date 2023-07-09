const debounce = (func,time=1000) => {
    let timeoutId;
    return(...args) => {
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null,args);
        },time);
    };
};