import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency/currency';
import { OrderByPipe } from './order-by/order-by';
import { GroupByPipe } from './group-by/group-by';
import { CounterPipe } from './counter/counter';
@NgModule({
	declarations: [CurrencyPipe, OrderByPipe, GroupByPipe, CounterPipe],
	imports: [],
	exports: [CurrencyPipe, OrderByPipe, GroupByPipe, CounterPipe]
})
export class PipesModule {}
