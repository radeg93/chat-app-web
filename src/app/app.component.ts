import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { Message } from './components/messages/message.interface';
import { UserSocketService } from './services/socket/user-socket.service';
import { SessionStorageService } from './services/storage/session-storage.service';
import { User } from './services/user/user.interface';
import { MessageSocketService } from './services/socket/message-socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    messages$!: Observable<Message[]>;
    activeUser$: BehaviorSubject<any> = new BehaviorSubject(null);
    destroy$: Subject<any> = new Subject();

    activeUser!: User;
    taggedUser!: User;
    messageText: FormControl = new FormControl();

    constructor(
        private messageService: MessageSocketService,
        private userSockerService: UserSocketService,
        private matDialog: MatDialog,
        private sessionStorageService: SessionStorageService,
    ) {}

    ngOnInit(): void {
        this.openUserDialog();
        this.messageService.setupSocketConnection();
        this.messageService.getAllMessages();
        this.messages$ = this.messageService.getAll();
        this.userSockerService.taggedUser$.pipe(takeUntil(this.destroy$)).subscribe((taggedUser: User) => {
            this.messageText.setValue(`@${taggedUser.name} `);
        });
    }

    openUserDialog(): void {
        const user: User | null = this.sessionStorageService.getItem('user');

        if (!user) {
            const dialogRef = this.matDialog.open(UserDialogComponent, {
                width: '250px',
                disableClose: true,
            });

            dialogRef
                .afterClosed()
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    console.log(res);
                    this.sessionStorageService.setItem('user', res);
                    this.activeUser = res;
                    this.userSockerService.sendUser(res?.name);
                });
        } else {
            this.activeUser$.next(user);
            this.activeUser = user;
        }
    }

    sendMessage() {
        this.messageService.sendMessage(this.messageText.value, this.activeUser.id, this.activeUser.name);
        this.messageText.patchValue(null);
    }

    ngOnDestroy() {
        this.destroy$.complete();
        this.destroy$.unsubscribe();
    }
}
