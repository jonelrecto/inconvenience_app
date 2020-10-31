<template>
  <q-page padding class="flex flex-center bg-primary">

    <span class="text-h3 text-center text-white">INCONVINIENT: BAD REVIEWS</span>
     <q-card class="my-card q-pa-md">
      
      <q-card-section>
        <div class="text-h3 text-center">Unrecommend a Business</div>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <div class="row">
            <q-input
              class="col q-pr-md"
              filled
              v-model="companyName"
              label="Name of Company *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter your company name']"
            />

            <q-input
              class="col q-pl-md"
              filled
              v-model="companyName"
              label="Complaint Title *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter your company name']"
            />
          </div>
          

          <div class="row">
            <q-input
            class="col q-pr-md"
              filled
              v-model="companyName"
              label="Name *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter your first name']"
            />

            <q-input
              class="col q-pl-md"
              filled
              v-model="companyName"
              label="Email *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter your last name']"
            />
          </div>

            <q-input
            label="Message"
            v-model="companyName"
            filled
            type="textarea"
            rows="10"
          />
          

          
          <div class="text-center">
            <q-btn type="submit" rounded size="lg" color="secondary" label="unrecommend"/>
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
      model: '',
      options: [
        { label: 'Owner', value: 'owner'},
        { label: 'Customer', value: 'customer'},
      ],
      companyName: '',
      acceptTermsAgreement: false,
    }
  },
  methods: {
    onSubmit () {
      console.log('asdf')
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
