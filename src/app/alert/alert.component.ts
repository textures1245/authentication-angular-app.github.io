import { Component, Input, OnInit } from '@angular/core';
import { Error } from '../auth/error.model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  //* danger, warning alert
  @Input() alertStatus = '';
  @Input() errorObj: Error = {status: null, message: null, name: null, messageHeader: null};

  //* success alert
  @Input() successMessageTopic = '';
  @Input() successMessage: string[] = []; 
  constructor() { }

  ngOnInit(): void {
  }

}
