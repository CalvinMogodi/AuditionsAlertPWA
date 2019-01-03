import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { UserProvider } from '../../providers/user/user';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { NgZone } from '@angular/core';

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
  message = '';
  rows = 1;
  @ViewChild('myInput', { read: ElementRef }) myInput: ElementRef;

  constructor(private zone: NgZone, public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public globalVariables: GlobalVariablesProvider, public userProvider: UserProvider) {

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

  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }

  sendMessage(str){
    let message = {
      message: str,
      date: new Date().toString(),
      user: this.displayName,
    };
    this.db.list('/chats').push(message);
    this.message = '';
  }

}
