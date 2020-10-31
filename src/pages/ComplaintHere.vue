<template>
  <q-page padding class="flex flex-center bg-primary">
     <q-card class="my-card q-pa-md">
      

      <q-card-section>
        <leave-complaint></leave-complaint>
      </q-card-section>

    </q-card>
  </q-page>
</template>
<script>
import LeaveComplaint from '../components/LeaveComplaint'

export default {
  components: {
    LeaveComplaint
  },
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
