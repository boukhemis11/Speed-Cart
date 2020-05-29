import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : [],
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
