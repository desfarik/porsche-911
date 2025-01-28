import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiButton, TuiRoot } from '@taiga-ui/core';
import { WA_NAVIGATOR } from '@ng-web-apis/common';
import { CarService, provideCarService } from './car-service/car.service';
import { CarInterfaceComponent } from './car-interface/car-interface.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TuiRoot,
    TuiButton,
    CarInterfaceComponent,
  ],
  providers: [provideCarService()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'porsche-911';
  navigator = inject(WA_NAVIGATOR)
  carService = inject(CarService)
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  carServer: BluetoothRemoteGATTServer | undefined = undefined;

  start = 0;

  async findAll() {
    const device = await this.navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
    })
    console.log(device);
    device.gatt?.disconnect();
  }


  async pairCar() {
    const device = await this.navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'Porsche' }],
    })
    this.carServer = await device.gatt?.connect()

    const service = await this.carServer?.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b')
    const picture = await service?.getCharacteristic('6e400003-b5a3-f393-e0a9-000000000002');
    await picture?.startNotifications();
    picture?.addEventListener('characteristicvaluechanged',async (event) => {
      // @ts-ignore
      const dataView = event.target.value as DataView;
      console.log(dataView);
      console.log('Потрачено:' + (Date.now() - this.start));
      // const blob = new Blob([dataView.buffer], { type: 'image/png' });
      // const imageBitmap = await createImageBitmap(blob);
      //
      // const canvas = document.createElement('canvas');
      // const ctx = canvas.getContext('2d');
      // ctx?.drawImage(imageBitmap, 0, 0);
      // Создаём ImageBitmap из Blob
      setTimeout(() => this.setParams(), 10);
    });
    console.log('ready');
  }

  unPair() {
    this.carServer?.disconnect()
  }

  async setParams() {
   this.carService.setParams();
  }

  async capturePicture() {
    const image = await this.carService.capturePicture();
    const context = this.canvas().nativeElement.getContext('2d')!;
    context?.drawImage(image, 0, 0, this.canvas().nativeElement.width, this.canvas().nativeElement.height);
    console.log(image);
    setTimeout(() => this.capturePicture(), 100);
  }
}
