<template>
  <div>
    
    <q-table
      title="Treats"
      :data="products"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :loading="loading"
    >

      <template v-slot:top>
        
        <q-select filled placeholder="Category" v-model="categoryFilter" :options="categoryOpts" label="Category" />
        <q-btn size="sm" color="secondary" icon="add" label="add product" @click="productDialog = true" />
        <q-space />
        <q-input filled dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-space />
        
      </template>
      
       <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="productTitle" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td key="category" :props="props">
            {{ props.row.category.label }}
          </q-td>
          <q-td key="unrecommended" :props="props">
              {{ props.row.unrecommended ? props.row.unrecommended : '0' }}
          </q-td>
          <q-td key="comments" :props="props">
            {{ props.row.comments ? props.row.comments : '0' }}
          </q-td>
          <q-td key="listingOwner" :props="props">
            <q-badge color="primary">
              {{ props.row.protein }}
            </q-badge>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn size="sm" color="info" icon="edit" round @click="toUpdateProduct(props.row)" />
            <q-btn size="sm" color="negative" icon="delete" round @click="removeProduct(props.row)"/>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog
      @hide="clearDialog"
      v-model="productDialog"
      persistent>
      
      <q-card
        style="min-width: 350px">
        <q-card-section>
          <!-- <q-btn color="primary" icon="check" label="OK" @click="test" /> -->
          <div
            class="text-h6">{{isEdit ? 'Edit Product' : 'New Product'}}</div>
        </q-card-section>
          
        <q-card-section>
          <q-uploader
            v-if="!isEdit"
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
          </q-uploader>

          <q-img v-else sizes="200px" :src="product.productImageUrl"/>
          <q-form
            @submit="isEdit ? updateProduct() : onSubmit()"
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
            <!-- <q-input
              filled
              v-model="product.companyName"
              label="Company Name *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Enter company name']"
            /> -->

             <q-select filled v-model="product.company" :options="companyOptions" label="Company *" 
            lazy-rules
              :rules="[ val => val || 'Select Company']"
              >
              <template v-slot:after>
                <q-btn size="sm" flat round color="primary" icon="add" @click="newCompanyDialog = true"/>
              </template>
             </q-select>

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

    <q-dialog v-model="newCompanyDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">New Company</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="row items-center">
          <new-company-form></new-company-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>
<script>
import NewCompanyForm from '../backend-components/addCompanyDialog'

export default {
  components: {
    NewCompanyForm
  },
  created () {
    if (this.categoryFilter.value === 'all') {
      this.$binding('products', this.$fbFirestore.collection('products'))
    } else {
      this.$binding('products', this.$fbFirestore.collection('products').where('category.label', '==', this.categoryFilter.label))
        .then(data => {
          this.products = data
          console.log(this.products)
        })
      
    }
  },
  async mounted () {
    await this.$binding('categories', this.$fbFirestore.collection('categories'))
    await this.$binding('products', this.$fbFirestore.collection('products'))
    await this.$binding('companies', this.$fbFirestore.collection('companies'))
  },
  data () {
    return {
      companies: [],
      isEdit: false,
      toEditProduct: {},
      product: {
        category: '',
        title: '',
        companyName: '',
        productImageUrl: null,
        message: '',
        description: ''
      },
      productDialog: false,
      isSaving: false,
      categories: [],
      products: [],
      filter: '',
      loading: false,
      columns: [
        { name: 'productTitle', align: 'left',label: 'Product Title', field: 'title' },
        { name: 'category' , align: 'left',label: 'Category', field: '[category.label]' },
        { name: 'unrecommended', align: 'center', label: 'Unrecommended', field: 'protein' },
        { name: 'comments',align: 'center',  label: 'Comments', field: 'sodium' },
        { name: 'listingOwner',  align: 'center', label: 'Listing Owner', field: 'sodium' },
        { name: 'actions', align: 'center',label: 'Actions', field: 'sodium' },
      ]
    }
  },
  watch: {
    categoryFilter: {
      handler () {
        if (this.categoryFilter.value === 'all') {
          this.$binding('products', this.$fbFirestore.collection('products'))
        } else {
          this.$binding('products', this.$fbFirestore.collection('products').where('category.label', '==', this.categoryFilter.label))
        }
      },
      deep: true
    }
  },
  computed: {
    newCompanyDialog: {
      get () {
        return this.$store.getters['ClientModule/getNewCompanyDialog']
      },
      set (v) {
        this.$store.commit('ClientModule/setNewCompanyDialog', v)
      }
    },
    categoryFilter: {
      get () {
        return this.$store.getters['BackendModule/getCategoryFilter']
      },
      set (v) {
        this.$store.commit('BackendModule/setCategoryFilter', v)
      }
    },
    categoryOpts () {
      let opts = []
      opts = this.categories.map(cat => {
        return {
          label: cat.categoryName,
          value: cat['.key']
        }
      })
      
      opts.push({ label: 'All', value: 'all' })
      return opts
    },
    companyOptions () {
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
    updateProduct () {
      this.$q.dialog({
          title: 'Update Confirmation',
          message: 'Do you want to update this product?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          let product = this.$store.getters['BackendModule/getPlainValue'](this.product)
          delete product['.key']
          delete product.__index
          delete product.productImageUrl
          delete product.dateCreated
          console.log(product)
          this.$fbFirestore.collection('products').doc(this.product['.key']).update({
            ...product
          }).then(() => {
            this.$q.notify({
              message: 'Product Updated',
              color: 'info'
            })
            this.clearDialog()
          }).catch(err => {
            this.$q.notify({
              message: 'An error occur',
              color: 'negative'
            })
          })
        })
    },
    toUpdateProduct (product) {
      console.log(product)
      this.toEditProduct = this.$store.getters['BackendModule/getPlainValue'](product)
      this.product = this.toEditProduct
      this.isEdit = true
      this.productDialog = true
    },
    removeProduct (product) {
      this.$q.dialog({
          title: 'Delete Confirmation',
          message: 'Do you want to remove this product?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.$fbFirestore.collection('products').doc(product['.key']).delete()
            .then(() => {
              this.$q.notify({
                message: 'Product Removed',
                color: 'info'
              })
            }).catch(err => {
              console.log(err, 'error')
              this.$q.notify({
                message: 'An error occur',
                color: 'negative'
              })
            })
        })
    },
     onSubmit () {
       this.$q.dialog({
          title: 'Save Confirmation',
          message: 'Save product?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          let product = {
            ...this.product,
            dateCreated: new Date()
          }
          let file = this.$refs.uploadRef.files[0]
          this.$store.dispatch('BackendModule/uploadFile', {file: file, fileLocation: 'ProductImages', fileName: product.title})
            .then(imageUrl => {
              product.productImageUrl = imageUrl

              this.$fbFirestore.collection('products').add(product)
                .then(() => {
                  this.$q.notify({
                    message: 'Product Added',
                    color: 'positive'
                  })
                  this.clearDialog()
                })
                .catch(err => {
                  console.log(err, 'err')
                  this.$q.notify({
                    message: 'An error occur',
                    color: 'negative'
                  })
                })
              }).catch(err => {
                this.$q.notify({
                    message: err,
                    color: 'negative'
                  })
              })
          
        })
     },
     clearDialog () {
       this.product = {
        dateCreated: '',
        category: '',
        title: '',
        companyName: '',
        productImageUrl: null,
        message: '',
        description: ''
       }
       this.isEdit = false
       this.isSaving = false
       this.productDialog = false 
     },
     test () {
       console.log(this.categoryFilter)
     }
  }
}
</script>
