import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoContextMenu]',
  standalone: true,
})
export class NoContextMenuDirective {

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
}
