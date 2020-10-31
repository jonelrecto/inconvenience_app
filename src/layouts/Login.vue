<template>
  <q-layout class="backgroundDesign" style="border: 1px solid black">
    <q-page-container  class="q-pa-md row q-gutter-md">
      <q-page padding class="tomiddle">
        <q-btn style="margin-left: 120px; margin-top: 200px" v-if="!isShowLoginCard" size="50px" color="secondary " round icon="mdi-account" @click="isShowLoginCard = true"></q-btn>
        
        <transition
           v-else
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-card >
          <q-card-section>
            <div class="items-center text-center">
             <span class="text-h3 text-weight-bold">Log In</span>
            </div>
          </q-card-section>

          <q-card-section>
             <q-input class="q-pb-md" v-model="user.email" filled type="email" label="Email" /> 

             <q-input v-model="user.password" filled :type="isPwd ? 'password' : 'text'" label="Password"  @keyup.enter="onSubmit()">
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn :loading="isLoggingIn" color="secondary" class="full-width q-mt-md" label="Login" @click="onSubmit()"/>
          </q-card-actions>
        </q-card>
        </transition>
      </q-page>
    </q-page-container>
    
  </q-layout>
  
</template>

<script>

export default {
  name: 'Login',
  created () {
    this.$store.dispatch('BackendModule/signOut')
  },
  data () {
    return {
      isShowLoginCard: false,
      isPwd: true,
      user: {
        email: '',
        password: '',  
      },
      isLoggingIn: false
    }
  },
  methods: {
    onSubmit () {
      this.isLoggingIn = true
      this.$store.dispatch('BackendModule/login', this.user)
        .then(resp => {
          this.isLoggingIn = false

          this.$router.push('/admin')
        }).catch(err => {
          this.isLoggingIn = false
          console.log(err)
        })
    }
  }
}
</script>

<style>
.tomiddle {
    position:fixed;
    top: 50%;
    left: 50%;
    width:30em;
    height:18em;
    margin-top: -9em; /*set to a negative number 1/2 of your height*/
    margin-left: -15em; /*set to a negative number 1/2 of your width*/
}
.backgroundDesign {
  background-image: url('../assets/digitalzen-courses-banner.jpg');
  background-size: cover;
}
</style>
