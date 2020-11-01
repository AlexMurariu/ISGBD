import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NotificatorComponent } from './components/notificator/notificator.component';
import { MainLayoutComponent } from './main-layout/main-layout/main-layout.component';



@NgModule({
  declarations: [NotificatorComponent, MainLayoutComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    MainLayoutComponent
  ]
})
export class CoreModule { }
