import { User, UserStateService } from 'src/app/core/user.state.service';
import { AuthState, AuthStateService } from 'src/app/auth/auth.state.service';
import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private userStateService = inject(UserStateService);
  private authStateService = inject(AuthStateService);
  private router = inject(Router);

  username: string = '';
  role = '';
  isPopNavHidden: boolean = true;

  ngOnInit(): void {
    this.authStateService.auth$.subscribe((authState) => {
      this.role = authState.role;
    });
    this.userStateService.user$.subscribe((userState) => {
      this.username = userState.username;
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
        this.authStateService.logout();
        break;
    }
    this.isPopNavHidden = true;
  }
}
