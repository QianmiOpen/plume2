declare const jest: { fn: Function };

export class MockConsole {
  constructor() {
    this._logs = [];
    this.mock();
  }

  private _logs;

  mock() {}

  mockFn() {
    return jest.fn(log => this._logs.push(log));
  }

  get logs() {
    return this._logs;
  }

  reset() {
    this._logs = [];
  }
}

export class MockWarn extends MockConsole {
  mock() {
    console.warn = this.mockFn();
  }
}

export class MockLog extends MockConsole {
  mock() {
    console.log = this.mockFn();
  }
}
