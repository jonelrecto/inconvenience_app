import Vue from 'vue'
import {format} from 'quasar'
const { capitalize } = format


export function twitterSignIn ({commit, dispatch}) {
  return new Promise((resolve, reject) => {
    commit('auth_request')
    const fbAuth = Vue.prototype.$fbAuth
    const twitterProvider = Vue.prototype.$twitterAuth
    const fbFirestore = Vue.prototype.$fbFirestore

    fbAuth.signInWithPopup(twitterProvider)
      .then((resp) => {
        console.log(resp, 'twitter resp')
        const { refreshToken } = resp.user
        const { profile } = resp.additionalUserInfo
        const { user } = resp
        
        if (resp.additionalUserInfo.isNewUser) {
          let userForm = {
            email: user.email,
            userName: resp.additionalUserInfo.username,
            dateCreated: new Date(),
            firstName: profile.name,
            lastName: profile.name,
            isEnable: true,
            type: 'normal'
          } 
          fbFirestore.collection('users').doc(user.uid).set(userForm)
            .then(() => {
              let userInfo = {
                userData: {...userForm,},
                uid: user.uid,
                displayName: user.displayName,  
                isEmailVerified: user.emailVerified,
                phoneNumber: user.phoneNumber,
              }
              commit('auth_success', { token: refreshToken, user: userInfo})
              resolve({message: 'user has been created'})
            }).catch(err => {
              reject(err)
            })
        } else {
          fbFirestore.collection('users').doc(user.uid).get()
            .then((doc) => {
              if (doc.exists) {
                console.log(doc.data(), 'in user mutation')
                // localStorage.setItem('user')
                // console.log(doc.data(), 'doc doc')
                // if (doc.data())
                if (doc.data().isEnable) {
                  let userInfo = {
                    userData: doc.data(),
                    uid: user.uid,
                    displayName: user.displayName,  
                    isEmailVerified: user.emailVerified,
                    phoneNumber: user.phoneNumber,
                  }
                  commit('auth_success', { token: refreshToken, user: userInfo})
                  resolve(resp)
                } else {
                  dispatch('signOut')
                  reject({message: 'You account has been disabled'})
                }
              } else {
                console.log('do documente')
                reject({message: 'no document found'})
              }
            })
        }

      }).catch(err => {
        console.log(err, 'err')
      })
  })
}


export function googleSignIn ({commit, dispatch}) {
  return new Promise ((resolve, reject) => {
    commit('auth_request')
    const fbAuth = Vue.prototype.$fbAuth
    const googleProvider = Vue.prototype.$googleAuth
    const fbFirestore = Vue.prototype.$fbFirestore

    fbAuth.signInWithPopup(googleProvider)
      .then(resp => {
        console.log(resp, 'google auth')
        const { refreshToken } = resp.user
        const { profile } = resp.additionalUserInfo
        const { user } = resp

        if (resp.additionalUserInfo.isNewUser) {
          let userForm = {
            email: user.email,
            userName: profile.name,
            dateCreated: new Date(),
            firstName: profile.given_name,
            lastName: profile.family_name,
            isEnable: true,
            type: 'normal'
          } 
          fbFirestore.collection('users').doc(user.uid).set(userForm)
            .then(() => {
              let userInfo = {
                userData: {...userForm,},
                uid: user.uid,
                displayName: user.displayName,  
                isEmailVerified: user.emailVerified,
                phoneNumber: user.phoneNumber,
              }
              commit('auth_success', { token: refreshToken, user: userInfo})
              resolve({message: 'user has been created'})
            }).catch(err => {
              reject(err)
            })
        } else {
          fbFirestore.collection('users').doc(user.uid).get()
            .then((doc) => {
              if (doc.exists) {
                console.log(doc.data(), 'in user mutation')
                // localStorage.setItem('user')
                // console.log(doc.data(), 'doc doc')
                // if (doc.data())
                if (doc.data().isEnable) {
                  let userInfo = {
                    userData: doc.data(),
                    uid: user.uid,
                    displayName: user.displayName,  
                    isEmailVerified: user.emailVerified,
                    phoneNumber: user.phoneNumber,
                  }
                  commit('auth_success', { token: refreshToken, user: userInfo})
                  resolve(resp)
                } else {
                  dispatch('signOut')
                  reject({message: 'You account has been disabled'})
                }
              } else {
                console.log('do documente')
                reject({message: 'no document found'})
              }
            })
        }

      }).catch(err => {
        console.log(err, 'err')
        reject({message: err })
      })
  })
}

export function fbSignIn ({commit, dispatch}) {
  return new Promise((resolve, reject) => {
    commit('auth_request')
    const fbAuth = Vue.prototype.$fbAuth
    const fbProvider = Vue.prototype.$facebookAuth
    const fbFirestore = Vue.prototype.$fbFirestore

    fbAuth.signInWithPopup(fbProvider)
      .then(resp => {
        console.log(resp, 'resp')
        const { refreshToken } = resp.user
        const { profile } = resp.additionalUserInfo
        const { user } = resp

        if (resp.additionalUserInfo.isNewUser) {
          let userForm = {
            email: user.email,
            userName: profile.first_name,
            dateCreated: new Date(),
            firstName: profile.first_name,
            lastName: profile.last_name,
            // contactNo: 
            isEnable: true,
            type: 'normal'
          } 
          fbFirestore.collection('users').doc(user.uid).set(userForm)
            .then(() => {
              let userInfo = {
                userData: {...userForm,},
                uid: user.uid,
                displayName: user.displayName,  
                isEmailVerified: user.emailVerified,
                phoneNumber: user.phoneNumber,
              }
              commit('auth_success', { token: refreshToken, user: userInfo})
              resolve({message: 'user has been created'})
            }).catch(err => {
              reject(err)
            })
        } else {
          fbFirestore.collection('users').doc(user.uid).get()
          .then((doc) => {
            if (doc.exists) {
              console.log(doc.data(), 'in user mutation')
              // localStorage.setItem('user')
              // console.log(doc.data(), 'doc doc')
              // if (doc.data())
              if (doc.data().isEnable) {
                let userInfo = {
                  userData: doc.data(),
                  uid: user.uid,
                  displayName: user.displayName,  
                  isEmailVerified: user.emailVerified,
                  phoneNumber: user.phoneNumber,
                }
                commit('auth_success', { token: refreshToken, user: userInfo})
                resolve(resp)
              } else {
                dispatch('signOut')
                reject({message: 'You account has been disabled'})
              }
            } else {
              console.log('do documente')
              reject({message: 'no document found'})
            }
          })
        }
      }).catch(err => {
        console.log(err, 'err ')
        reject({message: err})
      })
  })
}

export function signIn ({commit, dispatch}, user) {
  return new Promise((resolve, reject) => {
    commit('auth_request')
    const auth = Vue.prototype.$fbAuth
    const fbFirestore = Vue.prototype.$fbFirestore
    auth.signInWithEmailAndPassword(user.email, user.password)
      .then(resp => {
        const {refreshToken} = resp.user
        const {user} = resp
        
        console.log(user, 'user resp')

        fbFirestore.collection('users').doc(user.uid).get()
          .then((doc) => {
            if (doc.exists) {
              console.log(doc.data(), 'in user mutation')
              // localStorage.setItem('user')
              // console.log(doc.data(), 'doc doc')
              // if (doc.data())
              if (doc.data().isEnable) {
                let userInfo = {
                  userData: doc.data(),
                  uid: user.uid,
                  displayName: user.displayName,  
                  isEmailVerified: user.emailVerified,
                  phoneNumber: user.phoneNumber,
                }
                commit('auth_success', { token: refreshToken, user: userInfo})
                resolve(resp)
              } else {
                dispatch('signOut')
                reject({message: 'You account has been disabled'})
              }
              
              
            } else {
              console.log('do documente')
              reject({message: 'no document found'})
            }
          })
        
        
      }).catch(err => {
        reject(err)
      })
  })
}

export function login ({commit}, user) {
  return new Promise((resolve, reject) => {
    commit('auth_request')
    const auth = Vue.prototype.$fbAuth
    const fbFirestore = Vue.prototype.$fbFirestore
    auth.signInWithEmailAndPassword(user.email, user.password)
      .then(resp => {
        const {refreshToken} = resp.user
        const {user} = resp
        
        console.log(user, 'user resp')

        commit('auth_success', { token: refreshToken, user: user})
        resolve(resp)

      }).catch(err => {
        reject(err)
      })
  })
}

export function signOut ({commit}) {
  return new Promise((resolve, reject) => {
    // console.log(context, 'context')
    const auth = Vue.prototype.$fbAuth
    auth.signOut()
      .then(() => {
        commit('logout')
        localStorage.removeItem('token')
        resolve({message: 'signout succcessful'})
      }).catch(err => {
        reject((err))
      })
  })
}

export function createUser ({commit}, user) {
  return new Promise((resolve, reject) => {
    const auth = Vue.prototype.$fbAuth
    const firestore = Vue.prototype.$fbFirestore

    auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(resp => {
        let {uid} = resp.user
        delete user.password
        delete user.confirmPassword
        let userForm = {
          ...user,
          dateCreated: new Date(),
          type: 'normal'
        }
        firestore.collection('users').doc(uid).set(userForm)
          .then(() => {
            resolve({message: 'user has been created'})
          }).catch(err => {
            reject(err)
          })
      }).catch(err => {
        reject(err)
      })

  })
  

}

export function uploadFile (context, {file, fileLocation, fileName}) {
  const storageRef = Vue.prototype.$fbStorage

  return new Promise((resolve, reject) => {
    // let file = this.$refs.uploadRef.files[0]
    if (file) {
      let uploadImage = storageRef.child(`${fileLocation}/${capitalize(fileName)}`).put(file)
      uploadImage.on('state_changed', function (snapshot) {}, function (error) {
        // Handle unsuccessful uploads
        console.log('error occur', error)
        reject(error)
      }, function () {
        uploadImage.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          // console.log(downloadURL, 'URL')
          resolve(downloadURL)
        })
      })
    } else {
      reject('add image file')
    }
  })
}

