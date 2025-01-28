import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { CarCameraViewComponent } from '../car-camera-view/car-camera-view.component';
import { NoContextMenuDirective } from '../common/no-context-menu.directive';
import { CarService } from '../car-service/car.service';
import { TuiRipple } from '@taiga-ui/addon-mobile';
import { PoliceCarIconComponent } from './police-car-icon/police-car-icon.component';
import { MicrophoneButtonComponent } from './microphone-button/microphone-button.component';

@Component({
  selector: 'app-car-interface',
  standalone: true,
  imports: [
    TuiIcon,
    CarCameraViewComponent,
    NoContextMenuDirective,
    TuiButton,
    TuiRipple,
    PoliceCarIconComponent,
    MicrophoneButtonComponent,
  ],
  templateUrl: './car-interface.component.html',
  styleUrl: './car-interface.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarInterfaceComponent {

  carService = inject(CarService);


  toggleHeadLights() {

  }
}
