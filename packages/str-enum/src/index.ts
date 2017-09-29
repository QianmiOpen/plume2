export default function StrEnum<T extends string>(
  ...args: Array<T>
): { [K in T]: K };

export default function StrEnum<
  T extends { [key: string]: V },
  V extends string
>(args: T): T;

export default function StrEnum(...args: Array<any>) {
  if (typeof args[0] === 'string') {
    const result = {} as any;
    for (let a of args) {
      result[a] = a;
    }
    return result;
  } else {
    return args[0];
  }
}
