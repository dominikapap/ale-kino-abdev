import { AuthState, AuthStateService } from 'src/app/auth/auth.state.service';
import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user-interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private authStateService = inject(AuthStateService);
  constructor(private userService: UserService, private router: Router) {}
  user: User = {
    username: '',
    type: {
      isUser: false,
      isAdmin: false,
    },
  };

  authState: AuthState = {
    hasUserAuth: false,
    hasAdminAuth: false,
  };

  isPopNavHidden: boolean = true;

  ngOnInit(): void {
    this.authStateService.auth$.subscribe(authState => {
      this.authState = authState;
    })
    this.userService.subject.subscribe((user) => {
      this.user = user;
    });
  }

  togglePopNavMenu() {
    this.isPopNavHidden = !this.isPopNavHidden;
  }

  login() {
    this.router.navigate(['/login']);
  }

  handlePopupNavClick(navItem: string) {
    switch (navItem.toLowerCase()) {
      case 'ustawienia':
        break;
      case 'wyloguj':
        this.authStateService.logout()
        break;
    }
    console.log(navItem);

    this.isPopNavHidden = true;
  }
}
