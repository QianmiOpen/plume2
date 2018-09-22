import Store from '../store';

/**
 * 过滤出来relaxProps中的viewAction和function，避免JSON.stringify时候循环引用
 * @param relaxProps
 */
const relaxData = relaxProps => {
  const data = {};
  for (let prop in relaxProps) {
    if (prop === 'viewAction' || typeof relaxProps[prop] == 'function') {
      data[prop] = `store@${prop}`;
      continue;
    }
    data[prop] = relaxProps[prop];
  }
  return data;
};

/**
 * 输出relaxProps的json格式
 * @param relax
 * @param Relax
 */
export const outputRelaxProps = ({ Relax, relax, lifycycle }) => {
  console.groupCollapsed &&
    console.groupCollapsed(
      `${Relax.displayName} ${lifycycle} rx store ${relax._isNeedRxStore} 🚀`
    );

  console.log(
    'props => ' +
      JSON.stringify(
        {
          ...this.props,
          relaxProps: {
            ...this.props,
            ...relaxData(relax._relaxProps)
          }
        },
        null,
        2
      )
  );

  console.groupEnd && console.groupEnd();
};

export const ifNoStoreInContext = ctx => {
  if (!ctx._plume$Store) {
    throw new Error(
      'Could not find any store in context, Please add @StoreProvder on top React Component'
    );
  }
};

export const ifNoViewActionInStore = (store: Store) => {
  if (!store.viewAction) {
    console.error(
      `store can not find viewAction, please bind viewAction first`
    );
  }
};

const relaxCount = {};
export const ifTooManyRelaxContainer = {
  watch: Relax => {
    const count = relaxCount[Relax.displayName];
    if (typeof count != 'number') {
      relaxCount[Relax.displayName] = 1;
    } else {
      relaxCount[Relax.displayName]++;
    }
    //>=10 就触发规则
    //因为只想提示一次所以，就判断=10
    if (count == 10) {
      console.warn(
        `you have to many ${
          Relax.displayName
        } component, May be effect performance!`
      );
    }
  },
  unwatch: Relax => {
    relaxCount[Relax.displayName]--;
  }
};
