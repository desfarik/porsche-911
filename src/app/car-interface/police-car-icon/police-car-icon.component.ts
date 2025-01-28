import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-police-car-icon',
  standalone: true,
  imports: [],
  templateUrl: './police-car-icon.component.html',
  styleUrl: './police-car-icon.component.scss'
})
export class PoliceCarIconComponent {

  @Input()
  active: boolean = false;
}
