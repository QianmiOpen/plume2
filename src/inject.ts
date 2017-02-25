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
  defaultValue: () => {};

  constructor(methodName: string) {
    this.methodName = methodName
  }
}

export function storeMethod(methodName: string) {
  return new StoreMethod(methodName)
}