import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HistorialComponent } from "./historial/historial.component";
import { MainComponent } from "./main/main.component";
import { ListComponent } from "./list/list.component";
import { RegisterComponent } from "./register/register.component";

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'historial', component: HistorialComponent },
    { path: 'main', component: MainComponent },
    { path: 'list', component: ListComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: 'main', pathMatch: 'full' },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}