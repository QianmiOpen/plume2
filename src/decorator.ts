export function Action(msg: string): Function {
  return function(
    target: any,
    property: any,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    target._route || (target._route = {});

    if (process.env.NODE_ENV != 'production') {
      if (target._route[msg]) {
        const actorName = target.constructor.name;
        console.warn(
          `😎${actorName} had @Action('${msg}'), Please review your code.`
        );
      }
    }

    target._route[msg] = descriptor.value;
  };
}
