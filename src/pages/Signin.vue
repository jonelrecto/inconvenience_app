<template>
  <q-page padding class="flex flex-center bg-primary">
     <q-card class="my-card q-pa-md">
      
      <q-card-section>
        <div class="text-h3 text-center">Sign in</div>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >

          <q-input
            filled
            v-model="user.email"
            label="Email"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Enter your username']"
          />

           <q-input v-model="user.password" label="Password" filled :type="isPwd ? 'password' : 'text'" lazy-rules :rules="[ val => val && val.length > 0 || 'Enter your password']">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          
        
          <div class="text-center">
            <q-btn :loading="isLoggingIn" type="submit" rounded size="lg" color="secondary" label="submit"/>
          </div>

          <q-separator color="secondary"/>
          <div class="text-center">
            <span class="text-h6">Or login with</span>
            <div>
              <q-btn round flat color="secondary" icon="mdi-facebook"  @click="facebookSignIn" />
              <q-btn round flat color="secondary" icon="mdi-google-glass"  @click="googleSignIn"/>
              <q-btn round flat color="secondary" icon="mdi-twitter" @click="twitterSignIn" />
              <br />
              <br />
              <span>Dont have account? <span @click="$router.push('/signup')" class="text-blue-10" style="cursor: pointer">Sign up </span>now!</span>
            </div>
          </div>
          

        </q-form>
      </q-card-section>

    </q-card>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      isPwd: true,
      user: {
        email: '',
        password: ''
      },
      acceptTermsAgreement: false,
      isLoggingIn: false,
    }
  },
  methods: {
    onSubmit () {
      this.isLoggingIn = true
      this.$store.dispatch('BackendModule/signIn', this.user)
        .then(resp => {
          this.isLoggingIn = false

          this.$router.push('/')
        }).catch(err => {
          this.isLoggingIn = false
          this.$q.notify({
            message: err.message,
            icon: 'error',
            color: 'negative'
          })
          console.log(err)
        })
    },
    facebookSignIn () {
      this.$store.dispatch('BackendModule/fbSignIn')
        .then(resp => {
          // console.log(resp, 'resp')
          this.$router.push('/')
          this.$q.notify({
            message: 'Signed in',
            icon: 'info',
            color: 'positive'
          })
        }).catch(err => {
          console.log(err, 'err')
        })
    },
    googleSignIn () {
      this.$store.dispatch('BackendModule/googleSignIn')
        .then((resp) => {
          this.$router.push('/')
          this.$q.notify({
            message: 'Signed in',
            icon: 'info',
            color: 'positive'
          })
        }).catch(err => {
          console.log(err, 'err')
          this.$q.notify({
            message: 'An error occur',
            icon: 'error',
            color: 'negative'
          })
        }) 
    },
    twitterSignIn () {
      this.$store.dispatch('BackendModule/twitterSignIn')
        .then(resp => {
          this.$router.push('/')
          this.$q.notify({
            message: 'Signed in',
            icon: 'info',
            color: 'positive'
          })
        }).catch(err => {
          console.log(err, 'err')
          this.$q.notify({
            message: 'An error occur',
            icon: 'error',
            color: 'negative'
          })
        })
    }
  }
}
</script>
<style lang="stylus">
.my-card {
  width: 100%;
  max-width: 600px
}
</style>
