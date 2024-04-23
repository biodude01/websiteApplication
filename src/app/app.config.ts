import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from './app.routes';

@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) { }
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(HttpClientModule)]
};
