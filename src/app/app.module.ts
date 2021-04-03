import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {CommonModule, DatePipe} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MostrarErrosDirective} from './directives/mostrar-erros/mostrar-erros.directive';
import {MostrarPrimeiroErroDirective} from './directives/mostrar-erros/mostrar-primeiro-erro.directive';
import {MascaraDirective} from './directives/mascara.directive';
import {MascaraService} from './services/mascara.service';
import {UtilsService} from './services/utils.service';
import {AuthService} from './provider/auth.service';
import {IMOBILIARIA} from './utils/common';
import {TokenInterceptor} from './provider/token.interceptor';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats} from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import {ErrosFormularioService} from './services/erros-formulario.service';
import {ToastrModule, ToastrService} from 'ngx-toastr';

export const MOMENT_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'D/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM Y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Y'
  }
};


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MostrarErrosDirective,
    MostrarPrimeiroErroDirective,
    MascaraDirective,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatMomentDateModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    AuthService,
    FormBuilder,
    {
      provide: 'INTERCEPTOR_HOST',
      useValue: IMOBILIARIA()
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    MascaraService,
    UtilsService,
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt' },
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    ErrosFormularioService,
    ToastrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
