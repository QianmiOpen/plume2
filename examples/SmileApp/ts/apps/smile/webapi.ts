interface AsyncResult<T> {
  res: T;
  err: Error;
}

export const fetchCount = (): Promise<AsyncResult<number>> => {
  return new Promise((resolve) => {
    //mock async
    setTimeout(() => {
      resolve({
        res: Math.floor((Math.random() * 100)),
        err: null
      })
    }, 200)
  })
};