import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CounterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'counter'
})
export class CounterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    console.log(value);
    return value;
  }
}
