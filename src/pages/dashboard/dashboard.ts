import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform  } from 'ionic-angular';
import { UploadeventPage } from '../uploadevent/uploadevent';
import { AuditionProvider } from '../../providers/audition/audition';
import { AuditiondetailPage } from '../auditiondetail/auditiondetail';
import { GroupchatPage } from '../groupchat/groupchat';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AdMobPro } from '@ionic-native/admob-pro';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
interface AdMobType {
  banner: string,
  interstitial: string
};
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  public showSlides: boolean = false;
  public auditions: any[];
  public userType: string;
  public userId: any;

  constructor(public admob: AdMobPro, private platform: Platform, public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public storage: Storage, public auditionProvider: AuditionProvider, public toastCtrl: ToastController, private globalVariables: GlobalVariablesProvider) {
    //get audition events
    this.admob.onAdDismiss().subscribe(() => { });

    // preppare and load ad resource in background, e.g. at begining of game level
if(this.admob) this.admob.prepareInterstitial( {adId:'ca-app-pub-5466570245729953~4179509318', autoShow:false} );

// show the interstitial later, e.g. at end of game level
if(this.admob) this.admob.showInterstitial();
    this.userId = this.globalVariables.getUserId();
    this.storage.get('userType').then((val) => {
      if (val) {
        this.userType = val;
      }
    });
    this.storage.get('userId').then((val) => {
      if (val) {
        this.userId = val;
        this.globalVariables.setUserId(val);
      }
    });
    this.getAuditions();
  }

  getAuditions() {
    this.auditionProvider.getAuditions().
      subscribe((response: any[]) => {
        this.auditions = [];
        response.forEach(element => {
          element.isMine = false;
          if(this.userId == element.userId)
             element.isMine = true;
          if(element.auditionName === 'South Africa')
            this.auditions.push(element);          
        });
        this.auditions.sort(function (a, b) {
          let f = Date.parse(b.auditionDate);
          let s = Date.parse(a.auditionDate);
          f = f / 1000;
          s = s / 1000;
          return s - f;
        })
      });
  }

  toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
  }

  openDetails(audition){
    this.navCtrl.push(AuditiondetailPage,audition);
  }

  timeConverter(datetime) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = datetime.getFullYear();
    var month = months[datetime.getMonth()];
    var date = datetime.getDate();
    var time = date + ' ' + month + ' ' + year;
    return time;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

  openUpload() {
    this.navCtrl.push(UploadeventPage);
  } 

  deleteAuditions(audition) {
    this.http.post("http://197.242.149.23/api/deleteAudition", { auditionId: audition.auditionId }).subscribe((response: any) => {
      if (response) {
        this.showMessage('Event has been deleted successfull');
        this.getAuditions();
      } else {
        this.showMessage('We are unable to deleted event please try again later.');
      }
    });
  }

  editAudition(audition) {
    this.navCtrl.push(UploadeventPage,audition);
  }

  showMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  goToChat() {
    this.navCtrl.push(GroupchatPage);
  }

  onClick() {
    var admobid: AdMobType;
    admobid = { // for Windows Phone
      banner: 'ca-app-pub-234234234234324/234234234234',
      interstitial: 'ca-app-pub-234234234234324/234234234234'
    };
    this.admob.createBanner({
      adId: admobid.banner,
      position:this.admob.AD_POSITION.BOTTOM_CENTER, 
      autoShow: true
    })

  }
}
