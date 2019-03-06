import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { DashboardPage } from '../dashboard/dashboard';
import { HttpClient } from '@angular/common/http';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { HTTP } from '@ionic-native/http';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public user = {
    emailAddress: "",
    password: ""
  };
  public loginForm: FormGroup;
  public showError: boolean = false;
  public submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public toast: ToastController, public navParams: NavParams, public http: HttpClient, public globalVariables: GlobalVariablesProvider, public storage: Storage, public loadingCtrl: LoadingController, public formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      emailAddress: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  register() {
    this.navCtrl.push(SignupPage);
  }

  forgotPassword() {
    this.navCtrl.push(ForgotpasswordPage)
  }
  
  login(user) {
    this.submitAttempt = true;
     this.showError = false;
    if (this.loginForm.valid) {
      var loader = this.loadingCtrl.create({
        content: "Please wait..."
      });

      loader.present();  
      this.showErrors(user.password);    
      this.http.post("http://auditionsalertsa.dedicated.co.za/api/loginUser", user).subscribe((response: any) => {
        if (response.result == true) {
          this.storage.set('loggedin', true);
          this.globalVariables.setUserId(response.data.userId);
          this.storage.set('userType', response.data.userType);
          this.storage.set('userId', response.data.userId);
          this.globalVariables.setFirstTimeLogin(response.data.firstLogin);
          loader.dismiss();
          this.navCtrl.setRoot(TabsPage);
        }
        else if (response.result == false) {
          loader.dismiss();
          this.showError = true;
        }
      }), (error)=>{
        loader.dismiss();
        this.showErrors(error);
      };
    }

  }

  
  showErrors(str) {
    let toast = this.toast.create({
        message: str,
        duration: 10000,
        position: 'bottom'
    });
    toast.present();
}
}
