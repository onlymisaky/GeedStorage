export declare class GeedStorage {
    private type;
    private prefix;
    private storage;
    constructor(options?: {
        type?: 'session' | 'local';
        prefix?: string;
    });
    set<T>(key: string, value: T, options?: {
        expires?: number;
    }): void;
    get<T>(key: string): T | null;
    remove(key: string): void;
    clearAll(): void;
    private serialize;
    private isExpired;
}
export default GeedStorage;
