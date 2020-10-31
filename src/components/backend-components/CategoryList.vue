<template>
  <div>
    
    <div class="flex items-center justify-center q-gutter-md">
      <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="secondary"
        @click="newCategoryDialog = true" />
    </q-page-sticky>
      <q-card
        v-for="cat in categories"
        :key="cat['.key']"
        class="my-card">

        <q-img
          style="cursor: pointer"
          :src="cat.imageUrl">
          <div
            class="absolute-bottom">
            <div
              class="text-h6">{{cat.categoryName}}</div>
          </div>
        </q-img>

        <q-card-actions
          align="evenly">
          <q-btn
            round
            icon="view_list"
            color="positive"
            @click="viewProducts(cat)">
            <q-tooltip>
              Product List
            </q-tooltip>
          </q-btn>
          <q-btn
            round
            icon="edit"
            color="info"
            @click="updateCategoryDialog(cat)">
            <q-tooltip>
              Rename
            </q-tooltip>
          </q-btn>
          <q-btn
            round
            icon="delete"
            color="negative" 
            @click="removeCategory(cat['.key'])">
            <q-tooltip>
              Remove
            </q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
    

    <q-dialog
      @hide="clearDialog"
      v-model="newCategoryDialog"
      persistent>
      <q-card
        style="min-width: 350px">
        <q-card-section>
          <div
            class="text-h6">{{isEdit ? 'Update Category' : 'New Category'}}</div>
        </q-card-section>

        <q-card-section v-if="isEdit">
          <q-img sizes="200px" :src="toEditCategory.imageUrl"/>
          <div class="text-left">
            <p>Change Banner</p>
            <input type="file" id="file" ref="myFiles" class="custom-file-input" @change="previewFiles" multiple>
          </div>
        </q-card-section>

        <q-card-section v-else>
          <q-uploader
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
                    class="q-uploader__title">Upload category image</div>
                  <!-- <div
   class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div> -->
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
                <!-- <q-btn
                    v-if="scope.canUpload"
                    icon="cloud_upload"
                    @click="scope.upload"
                    round
                    dense
                    flat >
                  <q-tooltip>Upload Files</q-tooltip>
                </q-btn> -->

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
          
        </q-card-section>
        <q-input
            class="q-ma-md"
            label="Category Name *"
            v-model="newCategoryName"
            autofocus
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Enter category name']" />
        <q-card-actions
          align="right"
          class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup />
          <q-btn
            :loading="isSaving"
            flat
            label="Save"
            @click="isEdit ? updateCategory() : saveCategory()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { format  } from 'quasar'
const { capitalize } = format
export default {
  created () {
    this.storageRef = this.$firebaseApp.storage().ref()
  },
  mounted () {
    this.$binding('categories', this.$fbFirestore.collection('categories'))
  },
  data() {
    return {
      isEdit: false,
      toEditCategory: {},
      categories: [],
      storageRef: null,
      newCategoryName: '',
      newCategoryDialog: false,
      isSaving: false,
      files: []
    }
  },
  methods: {
    previewFiles () {
      this.files = this.$refs.myFiles.files
      if (this.files.length >= 2) {
        const input = this.$refs.myFiles
        input.type = 'text'
        input.type = 'file'
        this.files = []
      }
    },
    uploadImageFile() {
      return new Promise((resolve, reject) => {
        this.isSaving = true
        let file = this.$refs.uploadRef.files[0]
        console.log(file,' file')
        if (file) {
          let uploadImage = this.storageRef.child(`categoryImages/${capitalize(this.newCategoryName)}`).put(file)
          uploadImage.on('state_changed', function (snapshot) {}, function (error) {
            // Handle unsuccessful uploads
            console.log('error occur', error)
            this.isSaving = false
            reject(error)
          }, function () {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadImage.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              // console.log(downloadURL, 'URL')
              resolve(downloadURL)
            })
          })
        } else {
          reject('add image file')
        }

      })
    },
    updateImageFile(file) {
      return new Promise((resolve, reject) => {
        this.isSaving = true
        console.log(file,' file')
        if (file) {
          let uploadImage = this.storageRef.child(`categoryImages/${capitalize(this.newCategoryName)}`).put(file)
          uploadImage.on('state_changed', function (snapshot) {}, function (error) {
            // Handle unsuccessful uploads
            console.log('error occur', error)
            this.isSaving = false
            reject(error)
          }, function () {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadImage.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              // console.log(downloadURL, 'URL')
              resolve(downloadURL)
            })
          })
        } else {
          reject('add image file')
        }

      })
    },
    async saveCategory() {
      if (this.newCategoryName != '') {
        let imageUrl = await this.uploadImageFile()
        // console.log(this.$fbFirestore, 'fbFirestore')
        let category = {
          imageUrl: imageUrl,
          categoryName: capitalize (this.newCategoryName) 
        }
        this.$fbFirestore.collection('categories').add(category)
          .then(() => {
            this.newCategoryDialog = false
            this.isSaving = false
            this.newCategoryName = ''
            this.$refs.uploadRef.reset()
            this.$q.notify({
              message: 'Category Added',
              color: 'positive'
            })
          })
      }
    },
    removeCategory (id) {
      this.$q.dialog({
        title: 'Delete category',
        message: 'Do you want to remove ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$fbFirestore.collection('categories').doc(id).delete()
          .then(() => {
            this.$q.notify({
              message: 'Category Removed',
              color: 'info'
            })
          })
      })
    },
    updateCategoryDialog (category) {
      console.log(category)
      this.toEditCategory = category
      this.newCategoryName = category.categoryName
      this.isEdit = true
      this.newCategoryDialog = true
    },
    clearDialog () {
      this.isEdit = false
      this.newCategoryName = ''
    },
    updateCategory () {
      this.$q.dialog({
        title: 'Update category',
        message: 'Do you want to update ?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        this.isSaving = true
        if (this.files[0]) {
          let imageUrl = await this.updateImageFile(this.files[0])
          this.$fbFirestore.collection('categories').doc(this.toEditCategory['.key']).update({
            imageUrl: imageUrl,
            categoryName: this.newCategoryName
          }).then(() => {
            this.isSaving = false
            this.newCategoryDialog = false
            this.$q.notify({
              message: 'Category Updated',
              color: 'info'
            })
          })
        } else {
          this.$fbFirestore.collection('categories').doc(this.toEditCategory['.key']).update({
            categoryName: this.newCategoryName
          }).then(() => {
            this.isSaving = false
            this.newCategoryDialog = false
            this.$q.notify({
              message: 'Category Updated',
              color: 'info'
            })
          })
        }
      })
      
      

      
    },
    viewProducts (cat) {
      this.$store.commit('BackendModule/setCategoryFilter', { label: cat.categoryName, value: cat['.key'] })
      this.$store.commit('BackendModule/setTabState', 'products')
    }
  }
  
}
</script>

<style lang="stylus">
.my-card {
  width: 100%;
  max-width: 250px
}
</style>
