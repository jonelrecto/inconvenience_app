<template>
  <q-page padding>
    <q-table
      :data="claimListingUsers"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :pagination.sync="pagination"
    >

      <template v-slot:top>
        
        <span class="text-h4">Claim Listing Users</span>
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
            <div class="q-gutter-md">
              <q-btn color="positive" round icon="check" @click="approveRequest(props.row)" >
                <q-tooltip>
                  Approve
                </q-tooltip>
              </q-btn>
              <q-btn color="negative" round icon="close" @click="rejectRequest(props.row)" >
                <q-tooltip>
                  Reject
                </q-tooltip>
              </q-btn>
            </div>
            
          </q-td>
        </q-tr>
      </template>

    </q-table>
  </q-page>
</template>
<script>
export default {
  mounted () {
    this.$binding('claimListingUsers', this.$fbFirestore.collection('claim_listing'))
  },
  data () {
    return {
      claimListingUsers: [],
      filter: '',
      columns: [
        { name: 'lastName', align: 'center',label: 'Last Name', field: 'lastName' },
        { name: 'firstName', align: 'center', label: 'First Name', field: 'firstName' },
        { name: 'workPhone',  align: 'center', label: 'Work Phone', field: 'workPhone' },
        { name: 'workEmail',  align: 'center', label: 'Work Email', field: 'workEmail' },
        { name: 'roleinbussiness',  align: 'center', label: 'Role in Business', field: (role) => { return role.role.label} },
        { name: 'actions', align: 'center',label: 'Actions', field: 'sodium' },
      ],
      pagination: {
        sortBy: 'companyName',
        // page: 3,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
    }
  },
  methods: {
    rejectRequest (user) {
      this.$q.dialog({
        title: 'Reject Confirmation',
        message: 'Reject User?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$fbFirestore.collection('claim_listing').doc(user['.key']).delete()
          .then(() => {
            this.$q.notify({
              message: 'User has been rejected',
              icon: 'info',
              color: 'info'
            })
          })
      })
    },
    approveRequest (user) {
      this.$q.dialog({
        title: 'Approve Confirmation',
        message: 'Approved User?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        console.log(user,' user to approve')
        // first update his info
        let userKey = user.user.uid
        let userUpdate = {
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          companyName: user.companyName,
          workEmail: user.workEmail,
          workPhone: user.workPhone
        }
        this.$fbFirestore.collection('users').doc(userKey).update({
          ...userUpdate,
          type: 'owner'
        }).then(() => {
          this.$q.notify({
            message: 'User has been approved',
            icon: 'info',
            color: 'positive'
          })
          this.$fbFirestore.collection('claim_listing').doc(user['.key']).delete()
            .catch(err => {
              console.log(err, 'err')
              this.$q.notify({
                message: 'An error occur',
                icon: 'error',
                color: 'negative'
              })
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
