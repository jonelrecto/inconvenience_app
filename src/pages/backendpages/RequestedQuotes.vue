<template>
  <q-page padding>
    <q-table
      title="Treats"
      :data="requestedQuote"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :pagination.sync="pagination"
    >

      <template v-slot:top>
        
        <span class="text-h4">Requested Quote</span>
        <q-space />
        <q-input filled borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-tr :props="props">
          <q-td key="actions" :props="props">
            <div class="q-gutter-xs">
              <q-btn color="positive" icon="mdi-comment-plus" round @click="createRequest(props.row)" >
                <q-tooltip >
                  Create Request
                </q-tooltip>
              </q-btn>
              <q-btn color="negative" round icon="delete" @click="removeRequest(props.row)" >
                <q-tooltip >
                  Reject Request
                </q-tooltip>
              </q-btn>
            </div>
            
          </q-td>
        </q-tr>
      </template>

    </q-table>

    <q-dialog
      @hide="clearDialog"
      v-model="createNewProductDialog"
      persistent>
      
      <q-card
        style="min-width: 350px">
        <q-card-section>
          <!-- <q-btn color="primary" icon="check" label="OK" @click="test" /> -->
          <div
            class="text-h6">New Product</div>
        </q-card-section>
          
        <q-card-section>
          <!-- <q-uploader
            url="http://localhost:4444/upload"
            label="Custom header"
            ref="uploadRef">
            <template v-slot:header="scope">
              <div
                class="row no-wrap items-center q-pa-sm q-gutter-xs">
                <q-btn
                  v-if="scope.queuedFiles.length > 0"
                  icon="clear_all"
                  @click="scope.removeQueuedFiles"
                  round
                  dense
                  flat>
                  <q-tooltip>Clear All</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="scope.uploadedFiles.length > 0"
                  icon="done_all"
                  @click="scope.removeUploadedFiles"
                  round
                  dense
                  flat>
                  <q-tooltip>Remove Uploaded Files</q-tooltip>
                </q-btn>
                <q-spinner
                  v-if="scope.isUploading"
                  class="q-uploader__spinner" />
                <div
                  class="col">
                  <div
                    class="q-uploader__title">Upload product image</div>
                </div>
                <q-btn
                  v-if="scope.canAddFiles"
                  type="a"
                  icon="add_box"
                  round
                  dense
                  flat>
                  <q-uploader-add-trigger />
                  <q-tooltip>Pick Files</q-tooltip>
                </q-btn>
  
                <q-btn
                  v-if="scope.isUploading"
                  icon="clear"
                  @click="scope.abort"
                  round
                  dense
                  flat>
                  <q-tooltip>Abort Upload</q-tooltip>
                </q-btn>
              </div>
            </template>
          </q-uploader> -->

          <q-img sizes="200px" :src="product.productImageUrl"/>
          <q-form
            @submit="onSubmit()"
            class="q-gutter-md"
          >
            
            <q-select filled v-model="product.category" :options="newProductCategoryOpts" label="Category *" 
            lazy-rules
              :rules="[ val => val || 'Select category']"
              />

            <q-input
              filled
              v-model="product.title"
              label="Product Title *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter product title']"
            />
            <q-input
              filled
              v-model="product.companyName"
              label="Company Name *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter company name']"
            />
<!-- 
            <q-select filled v-model="product.companyName" :options="companiesOpts" label="Company Name *" 
            lazy-rules
              :rules="[ val => val || 'Select company']"
              /> -->

            <q-input
              v-model="product.message"
              filled
              type="textarea"
              label="Message *"
              autogrow
            />

            <q-input
              v-model="product.description"
              filled
              type="textarea"
              label="Description (optional)"
            />

            <div>
              <q-btn :loading="isSaving" label="Save" type="submit" color="secondary"/>
              <q-btn class="q-ml-md" label="Cancel" flat v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
        
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
export default {
  async mounted () {
    await this.$binding('requestedQuote', this.$fbFirestore.collection('requested_quote'))
    await this.$binding('categories', this.$fbFirestore.collection('categories'))
    await this.$binding('companies', this.$fbFirestore.collection('companies'))
  },
  data () {
    return {
      companies: [],
      product: {
        productImageUrl: '',
        category: '',
        title: '',
        companyName: '',
        message: '',
        description: ''
      },
      toRequestData: {},
      isSaving: false,
      createNewProductDialog: false,
      categories: [],
      requestedQuote: [],
      filter: '',
      columns: [
        { name: 'companyName', align: 'left',label: 'Company Name', field: 'companyName' },
        { name: 'complaintTitle', align: 'center', label: 'Title', field: 'complaintTitle' },
        { name: 'name',align: 'center',  label: 'Name', field: 'name' },
        { name: 'email',align: 'center',  label: 'Email', field: 'email' },
        { name: 'message',  align: 'center', label: 'Message', field: 'message' },
        { name: 'actions', align: 'center',label: 'Actions'},
      ],
      pagination: {
        sortBy: 'companyName',
        // page: 3,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
    }
  },
  computed: {
    companiesOpts () {
      return this.companies.map(company => {
        return { label: company.companyName, value: company['.key']}
      })
    },
    newProductCategoryOpts () {
      return this.categories.map(cat => {
        return {
          label: cat.categoryName,
          value: cat['.key']
        }
      })
    }
  },
  methods: {
    onSubmit () {
      this.$q.dialog({
        title: 'Confirm Save',
        message: 'Save product?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.isSaving = true
        console.log(this.product, 'to save')
        this.product.dateCreated = new Date()
        let comment = {
          complaint: this.product.title,
          complaintImageUrl: [this.product.productImageUrl],
          dateCreated: new Date(),
          email: this.toRequestData.email,
          isNotifiedByEmail: false,
          name: this.toRequestData.name,
          title: this.product.title,
          userId: this.toRequestData.user.uid
        }
        console.log(comment, 'to comment')
        console.log(this.toRequestData, 'torequest')
        let vm = this
        this.$fbFirestore.collection('products').add(this.product)
          .then((product) => {
            console.log(product, 'resp product')
            vm.$fbFirestore.collection('products').doc(product.id).collection('comments').add(comment)
              .then(() => {
                vm.$fbFirestore.collection('requested_quote').doc(vm.toRequestData['.key']).delete()
                  .then(() => {
                    vm.$q.notify({
                      message: 'Product has been saved',
                      icon: 'info',
                      color: 'positive'
                    })
                    vm.clearDialog()
                  })
                
              })
          })
      })
    },
    clearDialog () {
      this.toRequestData = {}
      this.product = {
        productImageUrl: '',
        category: '',
        title: '',
        companyName: '',
        message: '',
        description: ''
      }
      this.isSaving = false
      this.createNewProductDialog = false
    },
    createRequest (request) {
      console.log(request)
      this.toRequestData = request
      this.product.productImageUrl = request.complaintImageUrl ? request.complaintImageUrl[0] : ''
      this.product.title = request.complaintTitle
      this.product.companyName = request.companyName
      this.product.message = request.message
      this.createNewProductDialog = true
    },
    removeRequest (request) {
      console.log(request)
      this.$q.dialog({
        title: 'Reject Confirmation',
        message: 'Do you want to reject requets?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$fbFirestore.collection('requested_quote').doc(request['.key']).delete()
          .then(() => {
            this.$q.notify({
              message: 'Request has been removed',
              icon: 'info',
              color: 'info'
            })
          }).catch(err => {
            console.log(err)
            this.$q.notify({
              message: 'An error occur',
              icon: 'error',
              color: 'negative'
            })
          })
      })
      

    }
  }
}
</script>
