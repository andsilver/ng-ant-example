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
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import monaco from './shared/monaco-editor.config';

import en from '@angular/common/locales/en';
import { MainComponent } from './main/main.component';

registerLocaleData(en);

const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad: () => {
    monaco.apply((<any>window).monaco);
  }
}

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
    AppRoutingRoutingModule,
    MonacoEditorModule.forRoot(monacoConfig)
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercepterService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
