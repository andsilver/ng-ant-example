import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { AppRoutingRoutingModule } from './app-routing.module';
import { HttpIntercepterService } from './services/http-intercepter.service';
import { AcdcLoadingModule } from 'acdc-loading';

import en from '@angular/common/locales/en';
import { MainComponent } from './main/main.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AcdcLoadingModule.forRoot(),
    SharedModule,
    AppRoutingRoutingModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercepterService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
