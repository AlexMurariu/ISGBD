import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotificationModel } from 'src/app/shared/models/notification.model';
import { State } from 'src/app/state';
import { RemoveFromNotification } from 'src/app/state/notification.actions';
import * as fromNotification from 'src/app/state/notification.selector';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  notificationSelect: Observable<NotificationModel>

  constructor(private readonly store: Store<State>) { }

  ngOnInit(): void {
    this.notificationSelect = this.store.pipe(select(fromNotification.getNotification));
  }
 
  removeNotification(id: string) {
    this.store.dispatch(new RemoveFromNotification(id))
  }
}
