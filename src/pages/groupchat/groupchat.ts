import { Component, ElementRef, Input, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content  } from 'ionic-angular';
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
  message = '';
  rows = 1;
  userType = 'user';
  @ViewChild('myInput', { read: ElementRef }) myInput: ElementRef;
  @ViewChild(Content) content: Content;

  constructor(private zone: NgZone, public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public globalVariables: GlobalVariablesProvider, public userProvider: UserProvider) {

    db.database.ref().child('chats').orderByChild('date').on('value', (snapshot) => {
      var orders = snapshot.val();
      let totalCount = 0; 
      this.chats = [];
      if (orders != null) {        
        snapshot.forEach(snap => {          
          var chat = snap.val();
          let formattedchat = this.setChat(chat);
          formattedchat.key = snap.key;
          this.zone.run(() => { 
            this.chats.push(formattedchat);
            this.ngAfterContentInit();         
          });
        });
        this.chats.sort(function (a, b) {
          return b.date - a.date;              
        })        
      }
    });
    let userId = this.globalVariables.getUserId();
    userProvider.getUserById({ id: userId }).subscribe((response: any) => {
      this.user = response;
      this.userType = response.userType;
      this.displayName = response.firstName + ' ' + response.lastName;
      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupchatPage');
  }

  ngAfterContentInit(){
    if(this.content != undefined){
      this.content.scrollToBottom();
    }    
  }

  setChat(chat) {
    chat.isMine = false;
    if (chat.user.toString().toLowerCase() == this.displayName.toString().toLowerCase()) {
      chat.isMine = true;
    }

    var d = new Date(chat.date);
    var h = d.getHours().toString();
    if (h.toString().length == 1)
      h = "0" + h;

    var m = d.getMinutes().toString();
    if (m.toString().length == 1)
      m = "0" + m;

    var am_pm = d.getHours() >= 12 ? "PM" : "AM";
    var time = h + ":" + m + " " + am_pm;
    chat.time = time;

    return chat;
  }

  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }

  sendMessage(str) {
    let message = {
      message: str,
      date: new Date().toString(),
      user: this.displayName,
    };
    this.db.list('/chats').push(message);
    this.message = '';
  }

  deleteMessage(chat) {
    this.db.list('/chats').remove(chat.key);
  }

}
