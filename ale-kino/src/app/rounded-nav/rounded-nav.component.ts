import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rounded-nav',
  templateUrl: './rounded-nav.component.html',
  styleUrls: ['./rounded-nav.component.scss']
})
export class RoundedNavComponent implements OnInit {

  @Input() items: string[] =['18/11', '18/11','18/11','18/11','18/11','18/11','18/11'];
  @Input() listClass: any;
  @Input() itemClass: any;

  constructor() { }

  ngOnInit(): void {
  }

}
