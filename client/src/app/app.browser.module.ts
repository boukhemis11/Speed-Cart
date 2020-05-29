import { AppModule } from './app.module';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


export function WindowFactory() {
  return typeof window !== 'undefined' ? window : {};
}

@NgModule({
  imports: [
    AppModule,
    BrowserAnimationsModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }
