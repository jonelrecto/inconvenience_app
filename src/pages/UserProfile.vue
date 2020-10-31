<template>
  <q-page padding>
    <div class="flex flex-center">

      <q-card class="my-card q-pa-sm">
        <q-card-section>
          <div class="text-h6">User Profile</div>
        </q-card-section>

        <q-card-section>
          <div class="q-gutter-md">
            <q-input v-model="profile.firstName" type="text" label="First Name" />

            <q-input v-model="profile.lastName" type="text" label="Last Name" />

            <q-input v-model="email" type="text" label="Email" readonly/>
            
            <q-input v-model="profile.type" type="text" label="Type" readonly/>

            <q-input v-model="profile.contactNo" type="text" label="Contact No." />

          </div>
          
        </q-card-section>

        <q-separator dark />

        <q-card-actions align="around">
            <q-btn color="secondary" icon="save" label="save" @click="saveProfile" />
        </q-card-actions>
      </q-card>
      
    </div>
  </q-page>
</template>
<script>
export default {
  created () {
    this.profile.firstName = this.user.userData.firstName
    this.profile.lastName = this.user.userData.lastName
    this.profile.contactNo = this.user.userData.workPhone
    this.profile.type = this.user.userData.type
    this.email = this.user.userData.email
  },
  async mounted () {
    await this.$binding('userLoggedIn', this.$fbFirestore.collection('users').doc(this.user.uid))
      .then(resp => {
        console.log(resp, 'resp')
        this.profile.firstName = resp.firstName
        this.profile.lastName = resp.lastName
        this.profile.contactNo = resp.workPhone
        this.$store.commit('BackendModule/update_userData', {userData: resp})
      })
  },
  data () {
    return {
      isSaving: '',
      email: '',
      profile: {
        firstName: '',
        lastName: '',
        contactNo: '',
        type: ''
      },
      userLoggedIn: {}
    }
  },
  computed: {
    user () {
      return this.$store.getters['BackendModule/getUser']
    }
  },
  methods: {
    saveProfile () {
      this.$fbFirestore.collection('users').doc(this.user.uid).update({...this.profile})
        .then((resp) => {
          this.$q.notify({
            message: 'Profile Saved',
            icon: 'info',
            color: 'info' 
          })
          this.$forceUpdate()
        }).catch(err => {
          console.log(err)
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
  width: 100%
  max-width: 500px
}
  
</style>
