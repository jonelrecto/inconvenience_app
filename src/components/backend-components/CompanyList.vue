<template>
  <div class="q-pa-md">
    <q-table
      grid
      :data="companies"
      :columns="columns"
      row-key="name"
      :filter="filter"
      hide-header
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:top-left>
        <q-btn color="secondary" label="Add company" icon="add" @click="newCompanyDialog = true "></q-btn>
      </template>

       <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-section>
              <div class="q-gutter-sm text-center">
                <q-btn color="info" size="sm" icon="edit" label="Edit" @click="editCompany(props.row)" />
                <q-btn color="negative" size="sm" icon="delete" label="Remove" @click="removeCompany(props.row)" />
              </div>

            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>
                    <div class="text-right" style="width: 150px">
                      <span class="">
                          {{ col.value }}
                      </span>
                    </div>


                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>

    </q-table>


    <q-dialog v-model="newCompanyDialog" persistent >
      <q-card class="my-card">
        <q-card-section class="row items-center">
          <div class="text-h6">New Company</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <add-company-dialog></add-company-dialog>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editCompanyDialog" persistent @hide="onHide">
      <q-card class="my-card">
        <q-card-section class="row items-center">
          <div class="text-h6">Edit Company</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div>
            <q-form
              @submit="onUpdate"
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="toEditCompany.companyName"
                label="Company Name *"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please enter company name']"
              />

              <q-input
                filled
                type="textarea"
                v-model="toEditCompany.address"
                label="Address"
                lazy-rules
                :rules="[
                  val => val !== null && val !== '' || 'Please enter company address'
                ]"
              />

              <q-input
                filled
                type="number"
                v-model="toEditCompany.contactNo"
                label="Contact No. *"
                lazy-rules
                :rules="[
                  val => val !== null && val !== '' || 'Please enter contact number'
                ]"
              />

              <q-input
                filled
                v-model="toEditCompany.email"
                label="Email *"
                lazy-rules
                :rules="[
                  val => val !== null && val !== '' || 'Please enter company email'
                ]"
              />

              <div>
                <q-btn icon="save" label="Update" type="submit" color="positive"/>
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import AddCompanyDialog from '../backend-components/addCompanyDialog'

export default {
  components: {
    AddCompanyDialog
  },
  mounted () {
    this.$binding('companies', this.$fbFirestore.collection('companies'))
  },
  computed: {
    newCompanyDialog: {
      get () {
        return this.$store.getters['ClientModule/getNewCompanyDialog']
      },
      set (v) {
        this.$store.commit('ClientModule/setNewCompanyDialog', v)
      }
    }
  },
  data () {
    return {
      editCompanyDialog: false,
      toEditCompany: {
        companyName: '',
        address: '',
        contactNo: '',
        email: ''
      },
      companies: [],
      filter: '',
      columns: [
        { name: 'companyName', align: 'center', label: 'Company Name', field: 'companyName', sortable: true },
        { name: 'address', label: 'Address', field: 'address' },
        { name: 'contactEmail', label: 'Contact Email', field: 'contactNo' },
        { name: 'contactNumber', label: 'Contact Number', field: 'email' }
      ],
    }
  },
  methods: {
    removeCompany (company) {
      let key = company['.key']
      this.$q.dialog({
        title: 'Remove Confirmation',
        message: 'Do you want to remove ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$fbFirestore.collection('companies').doc(key).delete()
        .then(() => {
          this.$q.notify({
            message: 'Company removed',
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
    editCompany (company) {
      console.log(company, 'comp')
      this.toEditCompany = this.$store.getters['BackendModule/getPlainValue'](company)
      this.editCompanyDialog = true
    },
    onHide () {
      this.toEditCompany = {
        companyName: '',
        address: '',
        contactNo: '',
        email: ''
      }
    },
    onUpdate () {

      let key = this.toEditCompany['.key']
      delete this.toEditCompany.__index
      delete this.toEditCompany['.key']
      console.log(this.toEditCompany, 'to edit')
      console.log(key, 'key')
      this.$q.dialog({
        title: 'Update Confirmation',
        message: 'Do you want to update ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$fbFirestore.collection('companies').doc(key).set({
          ...this.toEditCompany
        })
        .then(() => {
          this.editCompanyDialog = false
          this.$q.notify({
            message: 'Company updated',
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
    }
  }
}
</script>
