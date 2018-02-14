import { UtilsProvider } from './../providers/utils/utils';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  //public loggedIn;

  rootPage: any = "home";
  public self = this;
  public copy;

  pages: Array<{ title: string, component: any, action?: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public utils: UtilsProvider, public events: Events) {

    this.initializeApp();      


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: "home" },
      { title: 'Portal', component: "portal" },
      { title: 'Logout', component: "logout", action: this.logout }
    ];

  }

  logout(){
    console.log('logout');
    sessionStorage.clear();
    localStorage.clear();
    document.getElementsByTagName('body')[0].innerHTML = "";
    window.location.href="";
    //this.utils.showLoading();
  }

  initializeApp() {
    this.platform.ready().then(() => { 
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault(); //disabled until we go native.
      // this.splashScreen.hide(); //disabled until we go native.
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  

}
