<template>
  <div>
    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="company.companyName"
        label="Company Name *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please enter company name']"
      />

      <q-input
        filled
        type="textarea"
        v-model="company.address"
        label="Address"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please enter company address'
        ]"
      />

      <q-input
        filled
        type="number"
        v-model="company.contactNo"
        label="Contact No. *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please enter contact number'
        ]"
      />

      <q-input
        filled
        v-model="company.email"
        label="Email *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please enter company email'
        ]"
      />

      <div>
        <q-btn icon="save" label="Save" type="submit" color="secondary"/>
      </div>
    </q-form>
  </div>
</template>
<script>
export default {
  props: {
    // company: {
    //   type: Object,
    //   default: function () {
    //     return {
    //       companyName: '',
    //       address: '',
    //       contactNo: '',
    //       email: ''
    //     }
    //   }
    // }
  },
  data () {
    return {
      name: null,
      age: null,
      company: {
        companyName: '',
        address: '',
        contactNo: '',
        email: ''
      }
    }
  },

  methods: {
    onSubmit () {
      this.$q.dialog({
        title: 'Confirm saved',
        message: 'Do you want to save ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$fbFirestore.collection('companies').add(this.company)
        .then(() => {
          this.$store.commit('ClientModule/setNewCompanyDialog', false)
          this.clearForm()
          this.$q.notify({
            message: 'Saved',
            icon: 'info',
            color: 'positive'
          })
        }).catch(err => {
          console.log(err, error),
          this.$q.notify({
            message: 'An error occur',
            icon: 'error',
            color: 'negative'
          })
        })
      })

      
    },
    test () {
      let vm = this
      console.log(vm, 'vm')
    },
    clearForm () {
      this.company = {
        companyName: '',
        address: '',
        contactNo: '',
        email: ''
      }
    }
  }
}
</script>
