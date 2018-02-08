import { NgModule } from '@angular/core';
import { CurrencyFormatterDirective } from './currency-formatter/currency-formatter';
import { PipesModule } from '../pipes/pipes.module';
@NgModule({
	declarations: [CurrencyFormatterDirective],
	imports: [
    PipesModule
  ],
	exports: [CurrencyFormatterDirective]
})
export class DirectivesModule {}
