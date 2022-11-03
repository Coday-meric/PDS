import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from "@angular/material/icon";
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import { ModalLoginComponent } from './modal-login/modal-login.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import { ModalAddEnqComponent } from './modal-add-enq/modal-add-enq.component';
import { ModalAddRdvComponent } from './modal-add-rdv/modal-add-rdv.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from '@angular/material/core';
import {DatePipe} from "@angular/common";
import {MatSnackBar} from '@angular/material/snack-bar';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { ModalConfirmRasComponent } from './modal-confirm-ras/modal-confirm-ras.component';
import { AdminComponent } from './admin/admin.component';
import { RouterModule, Routes } from '@angular/router';
import { FrontComponent } from './front/front.component';
registerLocaleData(localeFr);

const appRoutes: Routes = [
  { path: '', component: FrontComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
  ];

@NgModule({
  declarations: [
    AppComponent,
    ModalLoginComponent,
    ModalAddEnqComponent,
    ModalAddRdvComponent,
    ModalConfirmRasComponent,
    AdminComponent,
    FrontComponent
  ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        BrowserAnimationsModule,
        MatIconModule,
        MatCardModule,
        MatToolbarModule,
        MatDividerModule,
        MatButtonModule,
        MatChipsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        HttpClientModule,
        MatSlideToggleModule,
        RouterModule.forRoot(appRoutes, { enableTracing: true, useHash: false})

    ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }, DatePipe, MatSnackBar],
  bootstrap: [AppComponent]
})
export class AppModule { }
