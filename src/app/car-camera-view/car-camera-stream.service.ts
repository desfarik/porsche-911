import { computed, inject, Injectable, signal } from '@angular/core';
import { CarService } from '../car-service/car.service';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class CarCameraStreamService {

  delay = 100;
  carService = inject(CarService);

  stream$ = new ReplaySubject<ImageBitmap>(1);

  inProgress = signal(false);
  isStopped = computed(() => !this.inProgress());

  isLoading = computed(() => {
    if (this.isStopped()) {
      return false;
    }
    return (this.currentTime() - this.prevTime()) > 500;
  });

  private prevTime = signal(0);
  private currentTime = signal(0);

  private timeoutId: number | null = null;
  private currentTimeIntervalId: number | null = null;

  startStream(): Observable<ImageBitmap> {
    this.stream$ = new ReplaySubject<ImageBitmap>(1)
    this._startStream();
    return this.stream$;
  }

  private _startStream() {
    this.inProgress.set(true);
    this.tick();
    this.tickCurrentTime();
  }

  private async tick() {
    const image = await this.carService.capturePicture();
    this.prevTime.set(this.currentTime());
    this.stream$.next(image);
    if(this.inProgress()) {
      this.timeoutId = (setTimeout(() => this.tick(), this.delay)) as unknown as number;
    }
  }


  stopStream() {
    this.inProgress.set(false);
    this.stream$.complete();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if(this.currentTimeIntervalId) {
      clearInterval(this.currentTimeIntervalId);
      this.currentTimeIntervalId = null;
    }
  }

  private tickCurrentTime() {
    this.currentTimeIntervalId = setInterval(() => {
      this.currentTime.set(Date.now());
    }, 10) as unknown as number;
  }
}
