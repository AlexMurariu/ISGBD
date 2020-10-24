import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from "@angular/router";
import { AppRoutes } from './core/constants';

const routes: Routes = [
    {
        path: AppRoutes.SelectDatabase,
        loadChildren: () => import('./select-database/select-database.module').then(m => m.SelectDatabaseModule)
    },
    {
        path: AppRoutes.ViewDatabase,
        loadChildren: () => import('./view-database/view-database.module').then(m => m.ViewDatabaseModule)
    },
    {
        path: '',
        component: HomeComponent
    },
    {
        path: '*',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}