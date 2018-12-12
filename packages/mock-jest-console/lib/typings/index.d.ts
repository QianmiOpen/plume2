export declare class BaseMock {
    constructor();
    private _logs;
    mock(): void;
    mockFn(): any;
    readonly logs: any;
    reset(): void;
}
export declare class MockWarn extends BaseMock {
    mock(): void;
}
export declare class MockLog extends BaseMock {
    mock(): void;
}
export declare class MockDir extends BaseMock {
    mock(): void;
}
export declare class MockDebug extends BaseMock {
    mock(): void;
}
export declare class MockError extends BaseMock {
    mock(): void;
}
export declare class MockTrace extends BaseMock {
    mock(): void;
}
export declare class MockGroup extends BaseMock {
    mock(): void;
}
export declare class MockGroupCollapsed extends BaseMock {
    mock(): void;
}
export declare class MockTime extends BaseMock {
    mock(): void;
}
export declare class MockConsole extends BaseMock {
    mock(): void;
}
