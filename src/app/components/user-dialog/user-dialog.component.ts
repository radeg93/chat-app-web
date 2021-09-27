import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { UserSocketService } from 'src/app/services/socket/user-socket.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent implements OnInit, OnDestroy {
    destroy$: Subject<any> = new Subject();
    username = new FormControl();

    constructor(
        public dialogRef: MatDialogRef<UserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userService: UserService,
        private userSocketService: UserSocketService,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit() {}

    submit() {
        this.userService
            .getUserByName(this.username.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe((user) => {
                user ? this.dialogRef.close(user) : this.createNewUser();
            });
    }

    createNewUser() {
        this.userSocketService.sendUser(this.username.value);
        setTimeout(() => {
            this.userService
                .getUserByName(this.username.value)
                .pipe(takeUntil(this.destroy$))
                .subscribe((user) => {
                    console.log(user);
                    this.dialogRef.close(user);
                });
        }, 250);
    }

    ngOnDestroy() {
        this.destroy$.complete();
        this.destroy$.unsubscribe();
    }
}
