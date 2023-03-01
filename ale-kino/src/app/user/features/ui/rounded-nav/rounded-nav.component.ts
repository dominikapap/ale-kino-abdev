import { Component, OnInit, Input, Output,  EventEmitter } from '@angular/core';


@Component({
  selector: 'app-rounded-nav',
  templateUrl: './rounded-nav.component.html',
  styleUrls: ['./rounded-nav.component.scss']
})
export class RoundedNavComponent implements OnInit {

  @Input() items: string[] =[];
  @Input() listClass: string = '';
  @Input() itemClass: string ='';
  @Input() routerLink: string = '';



  @Output() selectValueEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  selectNewValue(value: string){
    this.selectValueEvent.emit(value);
  }

}
