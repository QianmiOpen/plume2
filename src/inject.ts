type PathVar = string | Array<string | number>

export class StorePath {
  path: PathVar;
  defaultValue: any;

  constructor(path: PathVar, defaultValue: any) {
    this.path = path
    this.defaultValue = defaultValue
  }
}

export function storePath(
  statePath: PathVar,
  defaultValue: any) {
  return new StorePath(statePath, defaultValue)
}

export class StoreMethod {
  methodName: string;
  defaultValue: Function;

  constructor(methodName: string, defaultValue?: Function) {
    this.methodName = methodName
    this.defaultValue = defaultValue || (() => { })
  }
}

export function storeMethod(methodName: string, defaultValue?: Function) {
  return new StoreMethod(methodName, defaultValue)
}