<template>
  <q-page padding>
    <q-table
      title="Treats"
      :data="users"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :loading="loading"
    >

      <template v-slot:top>
        
        <span class="text-h4">Users</span>
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
              <q-toggle color="green" @input="onToggleEnable(props.row)" v-model="props.row.isEnable" />
              <!-- <q-btn color="positive" round icon="check" @click="approveRequest(props.row)" />
              <q-btn color="negative" round icon="close" @click="rejectRequest(props.row)" /> -->
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
    this.$binding('users', this.$fbFirestore.collection('users'))
  },
  data () {
    return {
      users: [],
      loading: false,
      filter: '',
      rowCount: 10,
      columns: [
        { name: 'lastName', align: 'center',label: 'Last Name', field: (row) => row && row.lastName ? row.lastName : 'n/a' },
        { name: 'firstName', align: 'center', label: 'First Name', field: (row) => row && row.firstName ? row.firstName : 'n/a' },
        { name: 'username',  align: 'center', label: 'Username', field: 'userName' },
        { name: 'email',align: 'center',  label: 'Email', field: 'email' },
        { name: 'userType',align: 'center',  label: 'User Type', field: 'type' },
        { name: 'actions', align: 'center',label: 'Actions' },
      ]
    }
  },
  methods: {
    onToggleEnable (user) {
      console.log(user, 'user')
      this.$fbFirestore.collection('users').doc(user['.key']).update({
        isEnable: user.isEnable
      }).catch(err => {
        console.log(err)
        this.$q.notify({
          message: 'an error occur',
          icon: 'error',
          color: 'negative'
        })
        user.isEnable = !user.isEnable
      })
    }
  }
}
</script>
