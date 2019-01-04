import { AddExpenseComponent } from './../components/add-expense/add-expense';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AccountProvider } from '../providers/account/account';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomePageModule } from '../pages/home/home.module';
import { PortalPageModule } from '../pages/portal/portal.module';
import { UtilsProvider } from '../providers/utils/utils';
import { DirectivesModule } from '../directives/directives.module';
import { CurrencyPipe } from '../pipes/currency/currency';
//import { enableProdMode } from '@angular/core';
import { OrderByPipe } from '../pipes/order-by/order-by';
import { GroupByPipe } from '../pipes/group-by/group-by';
import { CounterPipe } from '../pipes/counter/counter';
import { ExpensesProvider } from '../providers/expenses/expenses';

//enableProdMode();


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HomePageModule,
    PortalPageModule,
    DirectivesModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddExpenseComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AccountProvider,
    UtilsProvider,
    CurrencyPipe,
    OrderByPipe,
    GroupByPipe,
    CounterPipe,
    ExpensesProvider
  ]
})
export class AppModule {}
