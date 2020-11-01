import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { NotificationModel, NotificationTypes } from 'src/app/shared/models/notification.model';

@Component({
  selector: 'app-notificator',
  templateUrl: './notificator.component.html',
})
export class NotificatorComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  @Input() notifications: Observable<NotificationModel>;
  @Output() onRemoveNotification: EventEmitter<string> = new EventEmitter<string>();
  constructor(private readonly toastr: ToastrService) { }

  ngOnInit() {
    if (this.notifications) {
      this.subscriptions.push(this.notifications
        .subscribe((notification: NotificationModel) => {
          if (!notification) {
            return;
          }
          
          switch (notification.type) {
            case NotificationTypes.success:
              this.showSuccess(notification);
              break;
            case NotificationTypes.error:
              this.showError(notification);
              break;
            case NotificationTypes.warning:
              this.showWarning(notification);
              break;
            case NotificationTypes.info:
              this.showInfo(notification);
              break;
          }
      }));
    }
  }

  showSuccess(success: NotificationModel) {
    this.toastr.success(success.message, success.title);
    this.removeNotification(success.id)
  }

  showError(error: NotificationModel) {
    this.toastr.error(error.message, error.title);
    this.removeNotification(error.id)
  }

  showWarning(warning: NotificationModel) {
    this.toastr.warning(warning.message, warning.title);
    this.removeNotification(warning.id)

  }

  showInfo(info: NotificationModel) {
    this.toastr.info(info.message, info.title);
    this.removeNotification(info.id)
  }

  removeNotification(id: string) {
    this.onRemoveNotification.emit(id)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach( subscription => {
        subscription.unsubscribe();
    });
  }
}
