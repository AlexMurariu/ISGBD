import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from "@angular/router";
import { AppRoutes } from './core/constants';

const routes: Routes = [
    {
        path: AppRoutes.ManageDatabases,
        loadChildren: () => import('./manage-databases/manage-databases.module').then(m => m.ManageDatabasesModule)
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
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}