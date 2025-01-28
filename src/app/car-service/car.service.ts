import { inject, Injectable, InjectionToken, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export const CAR_URL = new InjectionToken<Signal<string>>("CAR_URL");

export function provideCarService() {
  return [
    CarService,
    {
      provide: CAR_URL,
      useValue: signal('http://192.168.0.111')
    }
  ]
}

@Injectable()
export class CarService {
  baseUrl = inject(CAR_URL);
  http = inject(HttpClient);
  isHeadLightsActive = signal(false);
  isPoliceSignalsActive = signal(false);


  async capturePicture(): Promise<ImageBitmap> {
    const response = await fetch(`${ this.baseUrl() }/capture`, {
      method: 'GET'
    });
    const blob = await response.blob();
    return createImageBitmap(blob);
  }

  async setParams(): Promise<any> {
    const url = `${ this.baseUrl() }/settings`;
    return firstValueFrom(this.http.post(url, null, {
      params: {
        "age": '10',
        "name": 'ivan',
      }
    }));
  }

  toggleHeadLights() {
    const nextState = this.isHeadLightsActive() ? 'off' : 'on';
    this.isHeadLightsActive.set(!this.isHeadLightsActive());
    const url = `${ this.baseUrl() }/led/headlights`;
    return firstValueFrom(this.http.post(url, null, {
      params: {
        state: nextState,
      },
      responseType: 'text'
    })).then((state) => {
      this.isHeadLightsActive.set(state === 'on')
    });
  }

  togglePoliceSignals() {
    const nextState = this.isPoliceSignalsActive()? 'off' : 'on';
    this.isPoliceSignalsActive.set(!this.isPoliceSignalsActive());
  }
}
