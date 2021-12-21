export function getToken() {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      Authorization: token,
    };
  }

  return {};
}

export const parseParams = (search: string) => {
  let params: { [key: string]: string } = {};
  search = search.substring(1);
  search.split("&").forEach((item) => {
    let [key, value] = item.split("=");
    params[key] = value;
  });

  return params;
};

export const throttle = (callback: () => {}, timer: number) => {
  let isFirst = false;
  let execDate = +new Date();
  let throttleId:any = null;
  return () => {
    if (isFirst) {
      callback();
      execDate = +new Date();
    } else {
      let currentDate = +new Date();
      if ( currentDate - execDate >= timer) {
        callback();
        execDate = +new Date();
      } else {
        if(throttleId){
          clearTimeout(throttleId)
        }
        const timeWait = execDate + timer - (+new Date());
        throttleId = setTimeout(() => {
          callback();
          execDate = +new Date();
        },timeWait)
      }
    }
  };
};
