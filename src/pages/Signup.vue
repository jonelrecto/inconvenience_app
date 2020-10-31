<template>
  <q-page padding class="flex flex-center bg-primary">
     <q-card class="my-card q-pa-md">
      
      <q-card-section>
        <div v-if="!isDone" class="text-h3 text-center">Sign up</div>
        <div v-else class="text-h3 text-center">Thank you for signing up!
          <br />
          <q-btn rounded color="secondary" size="sm" label="go back" to="/signin" />
        </div>
      </q-card-section>

      <q-card-section v-if="!isDone">
        <!-- <q-btn color="primary" icon="check" label="OK" @click="test" /> -->
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="userForm.email"
            label="Email *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Enter your email']"
          />

          <q-input
            filled
            v-model="userForm.userName"
            label="Username*"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Enter your username']"
          />

           <q-input v-model="userForm.password" label="Password" filled :type="isPwd ? 'password' : 'text'" hint="Max of 6 character"
            lazy-rules
            :rules="[ val => val.length >= 6 || 'Password max character 6']"           >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            
            <q-input v-model="userForm.confirmPassword" label="Confirm Password" filled :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="[ val => val == userForm.password || 'Password did not match']"           >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>


    


          <q-toggle v-model="acceptTermsAgreement" >I accept the terms and agreement</q-toggle>
          
        
          <div class="text-center">
            <q-btn type="submit" rounded size="lg" color="secondary" label="submit" :loading="isSaving"/>
          </div>

          <q-separator color="secondary"/>
          <div class="text-center">
            <span class="text-h6">Or sign up with</span>
            <div>
              <q-btn round flat color="secondary" icon="mdi-facebook"  />
              <q-btn round flat color="secondary" icon="mdi-google-glass"  />
              <q-btn round flat color="secondary" icon="mdi-twitter"  />
              
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
      userForm: {
        email: '',
        userName: '',
        password: '',
        confirmPassword: '',
        isEnable: true
      },
      acceptTermsAgreement: false,
      isDone: false,
      isSaving: false,
    }
  },
  methods: {
    onSubmit () {
      if (this.acceptTermsAgreement) {
        this.isSaving = true
        this.$store.dispatch('BackendModule/createUser', this.userForm)
          .then(resp => {
            console.log(resp)
            this.isSaving = false
            this.isDone = true
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$q.notify({
          message: 'Please accept the terms and agreement',
          icon: 'error',
          color: 'negative'
        })
      }
    },
    test () {
      
      
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
