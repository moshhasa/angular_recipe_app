import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  
  @HostBinding('class.open') isOpen: boolean = false;

  constructor(private elementRef : ElementRef) { }

  // @HostListener('click') toggleOpen()
  // {
  //   alert('blah');
  //   this.isOpen = !this.isOpen;
  // } 

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elementRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
}
