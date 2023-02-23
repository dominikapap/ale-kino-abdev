import { HeaderNavService } from './header-nav.service';
import { UserStateService } from 'src/app/core/user.state.service';
import { AuthStateService } from 'src/app/auth/auth.state.service';
import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private userStateService = inject(UserStateService);
  private authStateService = inject(AuthStateService);
  headerNavState$= inject(HeaderNavService).setupState$;
  private router = inject(Router);

  username: string = '';
  role = '';
  isPopNavHidden: boolean = true;

  ngOnInit(): void {
    this.authStateService.auth$.subscribe((authState) => {
      this.role = authState.role;
    });
    this.userStateService.user$.subscribe((userState) => {
      this.username = userState?.username;
    });
  }

  togglePopNavMenu() {
    this.isPopNavHidden = !this.isPopNavHidden;
  }

  openPopNavMenu() {
    this.isPopNavHidden = false;
  }

  closePopNavMenu() {
    this.isPopNavHidden = true;
  }

  login() {
    this.router.navigate(['/login']);
  }

  handlePopupNavClick(navItem: string) {
    console.log('selected option',navItem)
    switch (navItem.toLowerCase()) {
      case 'wyloguj':
        this.authStateService.logout();
        this.userStateService.resetUser();
        break;
    }
    this.isPopNavHidden = true;
  }
}
