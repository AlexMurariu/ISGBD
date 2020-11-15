import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NotificatorComponent } from './components/notificator/notificator.component';
import { MainLayoutComponent } from './main-layout/main-layout/main-layout.component';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';



@NgModule({
  declarations: [NotificatorComponent, MainLayoutComponent, ConfirmationPopupComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    MainLayoutComponent
  ],
  entryComponents: [
    ConfirmationPopupComponent
  ]
})
export class CoreModule { }
