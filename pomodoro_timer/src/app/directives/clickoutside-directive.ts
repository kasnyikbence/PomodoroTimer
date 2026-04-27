import { Directive, ElementRef, EventEmitter, HostListener, inject, OnDestroy, Output, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appClickoutsideDirective]",
})
export class ClickoutsideDirective implements OnDestroy {
  @Output() clickOutside = new EventEmitter<void>();

  private readonly elementRef: ElementRef = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  private listener: (() => void) | null = null;

  constructor() {
    this.listener = this.renderer.listen("document", "click", (event: Event) => {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.clickOutside.emit();
      }
    });
  }


  ngOnDestroy(): void {
    this.listener?.();
  }
}
