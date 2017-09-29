export default function StrEnum<T extends string>(...args: Array<T>): {
    [K in T]: K;
};
export default function StrEnum<T extends {
    [key: string]: V;
}, V extends string>(args: T): T;
