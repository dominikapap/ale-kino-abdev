import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private userService: UserService) { }
  user: User = this.userService.getUser();
  isPopNavHidden: boolean = true;

  ngOnInit(): void {
  }

  togglePopNavMenu(){
    this.isPopNavHidden = !this.isPopNavHidden;
  }

}
