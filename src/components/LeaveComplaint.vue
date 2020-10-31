<template>
  <div>
    <div v-if="isDone" class="flex flex-center">
      <span class="text-h4 text-center">Thank you for sending a complaint.</span>
      <br />
      <q-btn color="secondary" size="sm" label="go back" to="/" />
    </div>
    <div v-else>
      <!-- <q-btn color="primary" icon="check" label="OK" @click="test" /> -->
      <span class="text-h4 text-center">LEAVE A COMPLAINT HERE</span>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="complaintForm.title"
            label="Complaint Title *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Enter your complaint title']"
          />

          <div class="row">
            <q-input
            class="col q-pr-md"
              filled
              readonly
              v-model="complaintForm.name"
              label="Name *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter your name']"
            />

            <q-input
              class="col q-pl-md"
              filled
              readonly
              v-model="complaintForm.email"
              label="Email *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter your email']"
            />
          </div>

          <q-input
            label="Describe your complaint *"
            v-model="complaintForm.complaint"
            filled
            type="textarea"
            rows="15"
            :rules="[ val => val && val.length > 0 || 'Describe your complaint']"
          />

          
          
        
          <div class="text-left">
            <p>Upload Photo</p>
            <input type="file" id="file" ref="myFiles" class="custom-file-input" 
      @change="previewFiles" multiple>
            <q-checkbox v-model="complaintForm.isNotifiedByEmail" label="I would like to be notified via email once this receives a reply. " />
            <div class="text-center" >
              <q-btn :loading="isSaving" type="submit" rounded size="lg" color="secondary" label="submit" />
            </div>
            
          </div>
          </q-form>
    </div>
    
  </div>
</template>
<script>
export default {
  created () {
    this.productId = this.$route.params.productId
    this.complaintForm.name = this.user.userData.userName
    this.complaintForm.email = this.user.userData.email
  },
  mounted () {
    this.$binding('comments', this.$fbFirestore.collection('products').doc(this.productId).collection('comments'))
      .then(resp => {
        console.log(resp, 'comments')
      })
  },
  data () {
    return {
      complaintForm: {
        title: '',
        name: '',
        email: '',
        complaint: '',
        isNotifiedByEmail: false,
      },
      productId: '',
      comments: [],
      files: [],
      isSaving: false,
      isDone: false,
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
      console.log(this.files)
      this.isSaving = true
      this.sendComplaint()
    },
    test () {
      var id = this.$route.params.productId
      // let complaintForm = {
      //   title: 'hehe',
      //   name: 'this user name',
      //   email: 'this.email',
      //   comment: 'wqeqweqweqwe',
      //   photoUploadedUrls: [
      //     ';lakjsdflkj',
      //     ';lkqjwe'
      //   ],
      //   sendEmailOnReply: false
      // }
      
      // console.log(id,this.user,  'id in complaint')
      // this.$fbFirestore.collection('products').doc(id).collection('comments').add(complaintForm)
      //   .then(() => {
      //     console.log('added succ')
      //   }).catch(err => {
      //     console.log(err, 'err')
      //   })
    },
    async sendComplaint () {
      try {
        var complaintImageUrl = []
        for (var i = 0; i < this.files.length; i++) {
            let file = this.files[i]
            let fileLocation = 'complaint_images'
            let fileName = `${this.complaintForm.title}_${this.complaintForm.name}_${i}`
            let imageUrl = await this.$store.dispatch('BackendModule/uploadFile', { file: file, fileLocation: fileLocation, fileName: fileName})
            complaintImageUrl.push(imageUrl) 
        }
        this.complaintForm.complaintImageUrl = complaintImageUrl
        this.complaintForm.dateCreated = new Date()
        this.complaintForm.userId = this.user.uid

        this.$fbFirestore.collection('products').doc(this.productId).collection('comments').add(this.complaintForm)
        .then(() => {
          console.log('added succ')
          this.$q.notify({
              message: 'Complaint has been sent',
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
      this.complaintForm = {
        title: '',
        name: '',
        email: '',
        description: ''
      }
      this.isSaving = false
      this.isDone = true
    }
  }
}
</script>
