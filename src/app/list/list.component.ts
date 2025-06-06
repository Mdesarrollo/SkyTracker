import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  users: any[] = [];
  lastUser: any = null;
  constructor(private router: Router, private userService: UserService, private authService: AuthService) { }

  navegarMain(){
    this.router.navigate(['main'])
  }

  async ngOnInit() {
    this.users = await this.userService.getUsers();
    console.log('Usuarios: ', this.users);

    const userData = localStorage.getItem('user');
    if (userData) {
      this.lastUser = JSON.parse(userData);
      console.log('Usuario anterior: ', this.lastUser);
    }
  }

  async onLogin() {
    this.users = await this.userService.getUsers();
    console.log('Usuarios: ', this.users);
  }

  // async logout() {
  //   await this.authService.logout();
  //   this.router.navigate(['login']);
  // }

  async logInicio(){
    this.router.navigate(['/']);
  }
}
