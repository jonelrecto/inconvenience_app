// import something here
import VueFirestore from 'vue-firestore'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


var config = {
  apiKey: 'AIzaSyDQV-vgAhHnYHlHtsmcMfaPH4xPzIiibbs',
  authDomain: 'inconvenience-9a4de.firebaseapp.com',
  databaseURL: 'https://inconvenience-9a4de.firebaseio.com',
  projectId: 'inconvenience-9a4de',
  storageBucket: 'inconvenience-9a4de.appspot.com',
  messagingSenderId: '357105387860',
  appId: '1:357105387860:web:8dfbc5c58b0b5a49ef60c1'
}

let firebaseApp = firebase.initializeApp(config)

const facebookAuth = new firebase.auth.FacebookAuthProvider()

const googleAuth = new firebase.auth.GoogleAuthProvider()

const twitterAuth = new firebase.auth.TwitterAuthProvider()



// "async" is optional
export default async ({ Vue }) => {
  // something to do
  Vue.prototype.$twitterAuth = twitterAuth
  Vue.prototype.$googleAuth = googleAuth
  Vue.prototype.$facebookAuth = facebookAuth
  Vue.prototype.$firebaseApp = firebaseApp
  Vue.prototype.$fbAuth = firebaseApp.auth()
  Vue.prototype.$fbFirestore = firebaseApp.firestore()
  Vue.prototype.$fbStorage = firebaseApp.storage().ref()
  Vue.use(VueFirestore)
}
