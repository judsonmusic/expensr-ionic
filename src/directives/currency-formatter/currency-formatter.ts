import {
  Directive,
  HostListener,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import { CurrencyPipe } from "../../pipes/currency/currency";
/**
 * Generated class for the CurrencyFormatterDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: "[currency-formatter]" // Attribute selector
})
export class CurrencyFormatterDirective {
  @Input() ngModel;
  @Output() ngModelChange = new EventEmitter();

  constructor(public cp: CurrencyPipe) {}

  ngOnInit() {
    window.setTimeout(() => {
      //this.ngModelChange.emit(this.cp.transform(this.ngModel.toString()));
    });
  }

  @HostListener("change")
  onChange() {
    if (this.ngModel) {
      window.setTimeout(() => {
        this.ngModelChange.emit(this.cp.transform(this.ngModel.toString()));
      }, 0);
    }
  }

  // @HostListener('ionBlur') onBlur() {
  //   window.setTimeout(() =>{
  //     this.ngModelChange.emit(this.cp.transform(this.ngModel.toString()));
  //   },1000);
  // }
}
