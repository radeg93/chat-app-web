import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSocketService } from 'src/app/services/socket/user-socket.service';
import { SessionStorageService } from 'src/app/services/storage/session-storage.service';
import { User } from 'src/app/services/user/user.interface';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
    @Input() public activeUser!: User;
    users$!: Observable<User[]>;

    constructor(private userSocketService: UserSocketService, private sessionStorageService: SessionStorageService) {}

    ngOnInit(): void {
        this.userSocketService.setupSocketConnection();
        this.userSocketService.getAllUsers();
        this.users$ = this.userSocketService.getAll();
    }

    tagUser(user: User) {
        const activeUser: User | null = this.sessionStorageService.getItem('user');
        if (activeUser?.id !== user.id) {
            this.userSocketService.setTaggedUser(user);
        }
    }

    // @HostListener('dblclick') onDoubleClicked() {
    //     // this.userSocketService.setTaggedUser()
    // }
}
