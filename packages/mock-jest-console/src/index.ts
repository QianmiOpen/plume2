declare const jest: { fn: Function };

export class BaseMock {
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

export class MockWarn extends BaseMock {
  mock() {
    console.warn = this.mockFn();
  }
}

export class MockLog extends BaseMock {
  mock() {
    console.log = this.mockFn();
  }
}

export class MockDir extends BaseMock {
  mock() {
    console.dir = this.mockFn();
  }
}

export class MockDebug extends BaseMock {
  mock() {
    console.debug = this.mockFn();
  }
}

export class MockError extends BaseMock {
  mock() {
    console.error = this.mockFn();
  }
}

export class MockConsole extends BaseMock {
  mock() {
    console.warn = this.mockFn();
    console.log = this.mockFn();
    console.dir = this.mockFn();
    console.debug = this.mockFn();
    console.error = this.mockFn();
  }
}
