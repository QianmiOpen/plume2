import { Map } from "immutable";
import { Action, Actor, IMap } from "../index";

//////////////////init state/////////////////////////
class HelloActor extends Actor {
  defaultState() {
    return {
      name: "plume2"
    };
  }

  @Action("change")
  change(state: IMap): IMap {
    return state.set("name", "plume++");
  }

  @Action()
  change2(state: IMap) {
    return state.set("name", "plume--");
  }
}

class ReceiveActor extends Actor {
  defaultState() {
    return {
      name: "receive actor"
    };
  }

  receive({ msg, state }: { msg: string; state: IMap }) {
    switch (msg) {
      case "change":
        return state.set("name", "change actor");
    }
  }
}

///////////////////////test suite/////////////////////
describe("actor test suite", () => {
  it("default state", () => {
    const helloActor = new HelloActor();
    expect(helloActor.defaultState()).toEqual({ name: "plume2" });

    const receive = new ReceiveActor();
    expect(receive.defaultState()).toEqual({ name: "receive actor" });
  });

  it("test receive ", () => {
    const receive = new ReceiveActor();
    const newState = receive.receive({
      msg: "change",
      state: Map({ name: "reveive actor" })
    });
    expect(newState.toJS()).toEqual({ name: "change actor" });
  });

  it("_route", () => {
    const helloActor = new HelloActor();
    expect((helloActor as any)._route).toEqual({
      change: helloActor.change,
      change2: helloActor.change2
    });
  });

  it("@Action method", () => {
    const helloActor = new HelloActor();
    const state = Map({ name: "plume" });
    const newState = helloActor.receive({
      msg: "change",
      state
    });

    expect(newState.toJS()).toEqual({ name: "plume++" });
  });

  it("@Action method with no default name", () => {
    const helloActor = new HelloActor();
    const state = Map({ name: "plume" });
    const newState = helloActor.receive({ msg: "change2", state });
    expect(newState.toJS()).toEqual({ name: "plume--" });
  });
});
