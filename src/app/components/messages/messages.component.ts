import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/services/user/user.interface';
import { Message } from './message.interface';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
    @Input() public messages!: Message[] | null;
    @Input() public activeUser!: User;

    constructor() {}

    ngOnInit(): void {}
}
