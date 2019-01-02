import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { GlobalVariablesProvider } from '../providers/global-variables/global-variables';
import { AdMobPro } from '@ionic-native/admob-pro';
import { UploadeventPage } from '../pages/uploadevent/uploadevent';
import { AboutusPage } from '../pages/aboutus/aboutus';
import { ContactusPage } from '../pages/contactus/contactus';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { FCM } from '@ionic-native/fcm';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(private admob: AdMobPro, private fcm: FCM, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage, public globalVariables: GlobalVariablesProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Upload', component: UploadeventPage },
      { title: 'About US', component: AboutusPage },
      { title: 'Contact Us', component: ContactusPage },
      { title: 'Logout', component: LoginPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get('loggedin').then((val) => {
        if (val) {
          this.rootPage = TabsPage;
          this.storage.get('userId').then((val) => {
            this.globalVariables.setUserId(val);
          });
        } else {
          this.rootPage = WelcomePage;
        }
      });
      this.fcm.subscribeToTopic('auditionsalertsa');

      this.fcm.getToken().then(token => {
        //backend.registerToken(token);
      });

      this.admob.onAdDismiss().subscribe(() => { });
    });
  }

  onClick() {
    let adId;
    if(this.platform.is('android')) {
      adId = 'ca-app-pub-5466570245729953~4179509318';
    } else if (this.platform.is('ios')) {
      adId = 'ca-app-pub-5466570245729953~4179509318';
    }
    this.admob.prepareInterstitial({adId: adId})
      .then(() => { this.admob.showInterstitial(); });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title == 'Logout') {
      this.storage.set('loggedin', false);
      this.nav.setRoot(page.component);
    } else {
      if (page.title == 'Home') {
        this.nav.setRoot(page.component);
      } else {
        this.nav.push(page.component);
      }
    }
  }
}
