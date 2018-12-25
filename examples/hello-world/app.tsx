import {
  Action,
  Actor,
  IMap,
  QL,
  Relax,
  Store,
  StoreProvider,
  TViewAction,
  ViewAction
} from "plume2";
import React from "react";
import ReactDOM from "react-dom";

class HelloViewAction extends ViewAction {
  handleClick = () => {
    this.store.dispatch("click");
  };
}

class HelloActor extends Actor {
  defaultState() {
    return {
      mott: "Build tools for human!!"
    };
  }

  @Action()
  click(state: IMap) {
    return state.set("mott", "click me");
  }
}

class WorldActor extends Actor {
  defaultState() {
    return {
      text: "plume"
    };
  }

  @Action()
  click(state: IMap) {
    return state.set("text", "plume2");
  }
}

const viewAction = {
  HelloViewAction
};

class AppStore extends Store {
  bindActor() {
    return [HelloActor, WorldActor];
  }

  bindViewAction() {
    return viewAction;
  }
}

const helloQL = QL("hello", [
  "mott",
  "text",
  (mott: string, text: string) => `${mott}:${text}`
]);

type THelloViewAction = TViewAction<typeof viewAction>;

@Relax
class Mott extends React.Component {
  props: {
    relaxProps?: {
      mott: string;
      text: string;
      hello: string;
      viewAction: THelloViewAction;
    };
  };
  static relaxProps = ["mott", "text", "viewAction", helloQL];

  render() {
    const { mott, text, hello, viewAction } = this.props.relaxProps;
    return (
      <div>
        <div onClick={viewAction.HelloViewAction.handleClick}>{mott}</div>
        <div>{text}</div>
        <div>{hello}</div>
      </div>
    );
  }
}

@StoreProvider(AppStore, { debug: true })
class HelloApp extends React.Component {
  render() {
    return <Mott />;
  }
}

ReactDOM.render(<HelloApp />, document.getElementById("app"));
