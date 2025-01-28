import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject, OnDestroy,
  signal,
  viewChild
} from '@angular/core';
import { CarService } from '../car-service/car.service';
import { TuiIcon, TuiLoader } from '@taiga-ui/core';
import { CarCameraStreamService } from './car-camera-stream.service';

@Component({
  selector: 'app-car-camera-view',
  standalone: true,
  imports: [
    TuiIcon,
    TuiLoader
  ],
  providers: [CarCameraStreamService],
  templateUrl: './car-camera-view.component.html',
  styleUrl: './car-camera-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarCameraViewComponent implements AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  streamService = inject(CarCameraStreamService);


  async ngAfterViewInit() {
    const context = this.canvas().nativeElement.getContext('2d')!;
    context.fillStyle = '#c2c9d6';
    context.fillRect(0, 0, this.canvas().nativeElement.width, this.canvas().nativeElement.height);
    this.startPlaying();
  }


  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');


  togglePlaying() {
    if (this.streamService.isStopped()) {
      this.startPlaying();
    } else {
      this.streamService.stopStream();
    }
  }

  startPlaying() {
    this.streamService.startStream().subscribe(image => {
      console.log('log');
      const context = this.canvas().nativeElement.getContext('2d')!;
      context.drawImage(image, 0, 0, this.canvas().nativeElement.width, this.canvas().nativeElement.height);
    });
  }
}
