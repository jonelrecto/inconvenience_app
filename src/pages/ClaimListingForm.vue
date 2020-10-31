<template>
  <q-page padding class="flex flex-center bg-primary">
     <q-card class="my-card q-pa-md">
      
      <q-card-section v-if="!isDone">
        <div class="text-h3 text-center">Claim A Listing</div>
      </q-card-section>

      <q-card-section v-if="isDone">
        <div class="text-h3 text-center">
          Thank you for claiming!
          <br/>
          Wait for an email for confirming your claim listing
          <br/>
          <q-btn rounded size="sm" to="/" color="secondary" label="Go back"/>
        </div>
      </q-card-section>

      <q-card-section v-if="!isDone">
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="claimForm.companyName"
            label="Company Name *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Enter your company name']"
          />

          <div class="row">
            <q-input
            class="col q-pr-md"
              filled
              v-model="claimForm.firstName"
              label="First Name *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter your first name']"
            />

            <q-input
              class="col q-pl-md"
              filled
              v-model="claimForm.lastName"
              label="Last Name *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter your last name']"
            />
          </div>

          <div class="row">
            <q-input
            class="col q-pr-md"
              filled
              v-model="claimForm.workEmail"
              label="Work Email*"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter your work email']"
            />

            <q-input
              class="col q-pl-md"
              filled
              v-model="claimForm.workPhone"
              label="Work Phone *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter your work phone']"
            />
          </div>

          <q-select filled v-model="claimForm.role" :options="options" label="Role of the business" :rules="[ val => val && val || 'Select role business']" />


          <q-toggle v-model="acceptTermsAgreement" >I accept the terms and agreement</q-toggle>
          
        
          <div class="text-center">
            <q-btn type="submit" rounded size="lg" color="secondary" label="submit"/>
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
      claimForm: {
        companyName: '',
        firstName: '',
        lastName: '',
        workEmail: '',
        workPhone: '',
        role: '',
      },
      options: [
        { label: 'Owner', value: 'owner'},
        { label: 'Customer', value: 'customer'},
      ],
      acceptTermsAgreement: false,
      isDone: false
    }
  },
  computed: {
    user () {
      return this.$store.getters['BackendModule/getUser']
    }
  },
  methods: {
    onSubmit () {
      if (this.acceptTermsAgreement) {
        this.claimForm.dateCreated = new Date()
        this.claimForm.user = this.user
        this.$fbFirestore.collection('claim_listing').add(this.claimForm)
          .then(() => {
            this.$q.notify({
              message: 'Thank you for claiming!',
              color: 'positive'
            })
            this.isDone = true
          })
      } else {
        this.$q.notify({
          message: 'Please accept terms and agreement',
          color: 'negative'
        })
      }
    },
    clearForm () {
      this.claimForm = {
         companyName: '',
          firstName: '',
          lastName: '',
          workEmail: '',
          workPhone: '',
          role: ''
      }
      this.acceptTermsAgreement = false
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
