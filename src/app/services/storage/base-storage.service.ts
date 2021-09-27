export abstract class BaseStorageService {
    abstract hasItem(key: string): boolean;
    abstract getItem<T>(key: string): T | null;
    abstract setItem<T>(key: string, value: T): void;
    abstract removeItem(key: string): void;
    abstract clear(): void;
    abstract clearWithPartialKey(key: string): void;
}
