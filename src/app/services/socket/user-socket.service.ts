import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../user/user.interface';
import { SocketCode } from './socket.enum';

@Injectable({
    providedIn: 'root',
})
export class UserSocketService {
    socket: any;
    users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
    activeUser$: Subject<User> = new Subject();
    taggedUser$: Subject<any> = new Subject();

    constructor() {}

    setupSocketConnection(): void {
        this.socket = io(environment.SOCKET_USER_ENDPOINT);
    }

    getAllUsers() {
        this.socket.on(SocketCode.GetAllUsers, (users: User[]) => {
            this.users$.next(users);
        });
    }

    getSingleUser() {
        this.socket.on(SocketCode.GetSingleMessage, (user: User) => {
            const users: User[] = [...this.users$.value, user];
            console.log(user);
            this.activeUser$.next(user);
            this.users$.next(users);
        });
    }

    sendUser(username: string) {
        this.socket.emit(SocketCode.SendUser, username);
        this.getSingleUser();
    }

    getAll(): Observable<User[]> {
        return this.users$.asObservable();
    }

    getActiveUser(): Observable<User> {
        return this.activeUser$.asObservable();
    }

    getTaggedUser(): Observable<User> {
        return this.taggedUser$.asObservable();
    }

    setTaggedUser(taggedUser: User): void {
        return this.taggedUser$.next(taggedUser);
    }
}
