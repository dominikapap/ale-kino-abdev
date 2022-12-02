import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() value: any;
  @Input() btnClass: any;
  @Input() icon: any = "";


  constructor() { }

  ngOnInit(): void {
  }

}
