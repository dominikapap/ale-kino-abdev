import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user-interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}
  user: User = {
    username: '',
    type: {
      isUser: false,
      isAdmin: false,
    },
  };

  isPopNavHidden: boolean = true;

  ngOnInit(): void {
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
        // this.router.navigate(['/settings']);
        break;
      case 'wyloguj':
        this.userService.subject.next({
          username: '',
          type: {
            isUser: false,
            isAdmin: false,
          },
        });
        break;
    }
    console.log(navItem);

    this.isPopNavHidden = true;
  }
}
