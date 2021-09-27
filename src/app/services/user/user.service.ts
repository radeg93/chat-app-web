import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user.interface';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly url = 'http://localhost:5100/user';

    private users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

    constructor(private http: HttpClient) {}

    public createUser(username: string): Observable<User> {
        return this.http.post<User>(this.url, { username });
    }

    public getAllUsers(): Observable<any> {
        return this.http.get<User[]>(this.url).pipe(map((users) => this.users$.next(users)));
    }

    public getUserByName(name: string): Observable<User> {
        return this.http.get<User>(`${this.url}/${name}`);
    }

    public getUsers = () => this.users$.asObservable();
}
