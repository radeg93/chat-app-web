import { Injectable } from '@angular/core';
import { BaseStorageService } from './base-storage.service';

@Injectable({
    providedIn: 'root',
})
export class SessionStorageService extends BaseStorageService {
    private static get storage(): Storage {
        return window?.sessionStorage;
    }

    hasItem(key: string): boolean {
        try {
            return SessionStorageService.storage.getItem(key) !== null;
        } catch {
            return false;
        }
    }

    getItem<T>(key: string): T | null {
        try {
            if (SessionStorageService.storage.getItem(key) === null) {
                return null;
            }
            return JSON.parse(SessionStorageService.storage[key]);
        } catch (error) {
            return null;
        }
    }

    setItem<T>(key: string, value: T): void {
        SessionStorageService.storage[key] = JSON.stringify(value);
    }

    clear(): void {
        SessionStorageService.storage.clear();
    }

    clearWithPartialKey(partialKey: string): void {
        partialKey = partialKey.toLowerCase();
        Object.keys(localStorage)
            .map((key: string) => key.toLowerCase())
            .filter((key: string) => key.indexOf(partialKey) === 0)
            .forEach((key: string) => this.removeItem(key));
    }

    removeItem(key: string): void {
        SessionStorageService.storage.removeItem(key);
    }
}
