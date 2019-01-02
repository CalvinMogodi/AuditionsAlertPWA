import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { UserProvider } from '../../providers/user/user';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

/**
 * Generated class for the GroupchatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})
export class GroupchatPage {
  user: any;
  displayName = "";
  itemValue = '';
  chats: any[];
  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public globalVariables: GlobalVariablesProvider, public userProvider: UserProvider) {

    db.database.ref().child('chats').orderByChild('date').on('value', (snapshot) => {
      var orders = snapshot.val();
      this.chats = [];
      if (orders != null) {
        snapshot.forEach(snap => {
          var chat = snap.val();
          this.chats.push(chat);
        });
      }
    });
    let userId = this.globalVariables.getUserId();
    userProvider.getUserById({ id: userId }).subscribe((response: any) => {
      this.user = response;
      this.displayName = this.user.firstName + ' ' + this.user.lastName;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupchatPage');
  }

}
