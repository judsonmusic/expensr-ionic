import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency/currency';
import { OrderByPipe } from './order-by/order-by';
import { GroupByPipe } from './group-by/group-by';
@NgModule({
	declarations: [CurrencyPipe, OrderByPipe, GroupByPipe],
	imports: [],
	exports: [CurrencyPipe, OrderByPipe, GroupByPipe]
})
export class PipesModule {}
