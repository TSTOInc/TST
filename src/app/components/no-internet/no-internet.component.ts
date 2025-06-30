import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/Connection/coneection.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-no-internet',
  imports: [],
  templateUrl: './no-internet.component.html',
  styleUrl: './no-internet.component.scss'
})
export class NoInternetComponent implements OnInit {
  isOnline!: Observable<boolean>;

  constructor(private connectionService: ConnectionService) {}

  ngOnInit() {
    this.isOnline = this.connectionService.isOnline$;
  }
}
