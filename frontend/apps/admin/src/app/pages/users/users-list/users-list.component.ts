import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@frontend/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, of, take, tap } from 'rxjs';

@Component({
    selector: 'admin-users-list',
    templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
    users: User[] = [];

    constructor(
        private usersService: UsersService,
        private toastMessageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getUsers();
    }

    private _getUsers() {
        this.usersService
            .getUsers()
            .pipe(
                take(1),
                tap((users: User[]) => {
                    this.users = users;
                }),
                catchError((err) => {
                    this.toastMessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Users could not be fetched, please try again later'
                    });
                    return of(err);
                })
            )
            .subscribe();
    }

    onEditUser(userId: string) {
        this.router.navigate([`users/form/${userId}`]);
    }

    onDeleteUser(userId: string) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this user?',
            header: 'Delete User',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usersService
                    .deleteUser(userId)
                    .pipe(
                        take(1),
                        tap((user: User) => {
                            this.toastMessageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: `User ${user.name} deleted`
                            });
                            this._getUsers();
                        }),
                        catchError((err) => {
                            this.toastMessageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Category was not deleted, please try again later'
                            });
                            return of(err);
                        })
                    )
                    .subscribe();
            }
        });
    }
}
