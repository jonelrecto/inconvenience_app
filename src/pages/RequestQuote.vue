<template>
  <q-page padding class="bg-primary">
    <div v-if="isDone" class="flex flex-center q-pa-md q-mt-md text-center">
      <span class="q-pb-md text-h3 text-white">Thank you for request we will review your later.</span>
    </div>
    <div v-else>
      <span class="q-pb-md text-h3 flex flex-center text-white">REQUEST A QUOTE</span>
        <div class="flex flex-center">
          <q-card class="my-card q-pa-md">
            <q-card-section>
              <q-form
                @submit="onSubmit"
                class="q-gutter-md"
              >
                <div class="row">
                  <q-input
                    class="col q-pr-md"
                    filled
                    v-model="requestForm.companyName"
                    label="Name of Company *"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Enter your company name']"
                  />

                  <q-input
                    class="col q-pl-md"
                    filled
                    v-model="requestForm.complaintTitle"
                    label="Complaint Title *"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Enter your complaint title']"
                  />
                </div>
                

                <div class="row">
                  <q-input
                  class="col q-pr-md"
                    filled
                    v-model="requestForm.name"
                    label="Name *"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Enter your name']"
                  />

                  <q-input
                    class="col q-pl-md"
                    filled
                    v-model="requestForm.email"
                    label="Email *"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Enter your email']"
                  />
                </div>

                  <q-input
                  label="Message"
                  v-model="requestForm.message"
                  filled
                  type="textarea"
                  rows="10"
                />
                <div class="text-left">
                <p>Upload Photo</p>
                <input type="file" id="file" ref="myFiles" class="custom-file-input" 
          @change="previewFiles" multiple>
                
              </div>

                
                <div class="text-center">
                  <q-btn :loading="isSaving" type="submit" rounded size="lg" color="secondary" label="submit"/>
                </div>
              </q-form>
            </q-card-section>

          </q-card>
        </div>
    </div>
    
     
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      files: [],
      requestForm: {
        companyName: '',
        complaintTitle: '',
        name: '',
        email: '',
        message: ''
      },
      isSaving: false,
      isDone: false
    }
  },
  computed: {
    user () {
      return this.$store.getters['BackendModule/getUser']
    }
  },
  methods: {
    previewFiles () {
      this.files = this.$refs.myFiles.files
      if (this.files.length >= 5) {
        const input = this.$refs.myFiles
        input.type = 'text'
        input.type = 'file'
        this.files = []
      }
    },
    onSubmit () {
      try {
        if (this.files.length > 0) {
          this.isSaving = true
          // console.log(this.requestForm)
          this.requestForm.user = this.user
          if (this.files) {
            this.sendRequest()
          } else {
            this.$fbFirestore.collection('requested_quote').add(this.requestForm)
              .then(() => {
                this.$q.notify({
                  message: 'Request has been sent',
                  icon: 'info',
                  color: 'positive'
                })
                this.clearForm()
              })
          }
        } else {
          this.$q.notify({
            message: 'Please upload some image',
            icon: 'info',
            color: 'negative'
          })
        }
        
      } catch (err) {
        console.log(err, 'err')
        this.$q.notify({
          message: 'An error occur',
          icon: 'error',
          color: 'negative'
        })
      }
      
      
    },
    async sendRequest () {
      try {
        var requestImageUrl = []
        for (var i = 0; i < this.files.length; i++) {
            let file = this.files[i]
            let fileLocation = 'request_quote_images'
            let fileName = `${this.requestForm.companyName}_${this.requestForm.name}_${i}`
            let imageUrl = await this.$store.dispatch('BackendModule/uploadFile', { file: file, fileLocation: fileLocation, fileName: fileName})
            requestImageUrl.push(imageUrl) 
        }
        this.requestForm.complaintImageUrl = requestImageUrl
        this.requestForm.dateCreated = new Date()

        this.$fbFirestore.collection('requested_quote').add(this.requestForm)
        .then(() => {
          this.$q.notify({
              message: 'Request has been sent',
              icon: 'info',
              color: 'positive'
            })
            this.clearForm()
        }).catch(err => {
          console.log(err, 'err')
        })

        // this.$fbFirestore.collection('complaints').add(this.complaintForm)
        //   .then(() => {
        //     this.$q.notify({
        //       message: 'Complaint has been sent',
        //       icon: 'info',
        //       color: 'positive'
        //     })
        //     this.clearForm()
        //   })
      } catch (err) {
        console.log(err, 'err')
        this.$q.notify({
          message: 'an error occur',
          icon: 'error',
          color: 'negative'
        })
      }
    },
    clearForm () {
      this.requestForm = {
        companyName: '',
        complaintTitle: '',
        name: '',
        email: '',
        message: ''
      }
      this.isSaving = false
      this.files = []
      this.isDone = true
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
