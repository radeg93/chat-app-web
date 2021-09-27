import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from 'src/app/components/messages/message.interface';
import { environment } from 'src/environments/environment';
import { SocketCode } from './socket.enum';

@Injectable({
    providedIn: 'root',
})
export class MessageSocketService {
    socket: any;
    messages$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

    constructor() {}

    setupSocketConnection(): void {
        this.socket = io(environment.SOCKET_MESSAGE_ENDPOINT);
    }

    getAllMessages() {
        this.socket.on(SocketCode.GetAllMessages, (messages: Message[]) => {
            this.messages$.next(messages);
        });
    }

    getSingleMessage() {
        this.socket.on(SocketCode.GetSingleMessage, (message: Message) => {
            const messages: Message[] = [...this.messages$.value, message];
            this.messages$.next(messages);
        });
    }

    sendMessage(message: string, senderId: number, senderName: string) {
        this.socket.emit(SocketCode.SendMessage, { message, senderId, senderName });
        this.getSingleMessage();
    }

    getAll(): Observable<Message[]> {
        return this.messages$.asObservable();
    }
}
