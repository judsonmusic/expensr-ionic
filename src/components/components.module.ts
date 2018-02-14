import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { AddExpenseComponent } from './add-expense/add-expense';
@NgModule({
	declarations: [AddExpenseComponent],
	imports: [
		IonicPageModule.forChild(AddExpenseComponent)
	],
	exports: [AddExpenseComponent]
})
export class ComponentsModule {}
