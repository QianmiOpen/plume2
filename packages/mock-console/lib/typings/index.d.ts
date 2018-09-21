/// <reference types="jest" />
export declare class MockConsole {
    constructor();
    private _logs;
    mock(): void;
    mockFn(): jest.Mock<any>;
    readonly logs: any;
    reset(): void;
}
export declare class MockWarn extends MockConsole {
    mock(): void;
}
export declare class MockLog extends MockConsole {
    mock(): void;
}
