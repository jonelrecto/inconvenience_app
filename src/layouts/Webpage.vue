<template>
  <q-layout view="lHh Lpr lff">
    <q-header  bordered>
      <q-toolbar class="q-pa-md">


        <q-toolbar-title style="margin-left: 5%" class="q-gutter-md">
          <img :src="require('../assets/Red.png')" alt="" style="cursor: pointer; height: 60px;" @click="$router.push('/')">

          <!-- <q-btn-dropdown label="Categories" :ripple="false">

          </q-btn-dropdown> -->

          <span class="text-h6" style="cursor: pointer">
            Categories
            <q-icon name="arrow_drop_down"></q-icon>
            <q-menu>
              <q-list style="min-width: 100px" class="text-subtitle2">
                <q-item clickable v-close-popup @click="$router.push('/allproducts')">
                  <q-item-section>All Products</q-item-section>
                </q-item>
                <q-separator />
                <q-item v-for="cat in categories" :key="cat['.key']" clickable v-close-popup :to="`/archive/${cat['.key']}`">
                  <q-item-section>{{cat.categoryName}}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </span>
          <span class="text-h6" @click="$router.push('/aboutus')" >About</span>
          <span class="text-h6" @click="toClaimListing">Claim Listing</span>
          <span v-if="user" @click="$router.push('/requestquote')" >Request a quote</span>
          <span v-if="!user" @click="$router.push('/signin')">Sign in</span>


        </q-toolbar-title>
        <q-input dark borderless v-model="search" input-class="text-right q-pr-md" class="q-ml-md" @keyup.enter="$router.push(`/allproducts/${search}`)">
          <template v-slot:append>
            <q-icon v-if="search === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
          </template>
        </q-input>
        <!-- <q-btn flat icon="menu" size="lg"></q-btn> -->
        <q-btn v-if="!user" rounded color="secondary" label="Leave Complaint" @click="toRequestQuote"></q-btn>
        <q-btn v-else round icon="account_circle" color="secondary">
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Settings</div>
                <q-btn to="/profile" size="sm" color="primary" icon="mdi-account-edit" label="Profile " />
                <!-- <q-toggle v-model="bluetooth" label="Bluetooth" /> -->
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://gravatar.com/avatar/1442195a7782726edeceb20b029d54cf?s=400&d=robohash&r=x">
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">{{ user.userData.userName}}</div>

                <q-btn
                  color="primary"
                  label="Logout"
                  push
                  size="sm"
                  @click="signOut"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>


    <q-footer class="bg-grey-8 text-white q-pa-md">
      <q-toolbar>
        <q-toolbar-title>
         <img :src="require('../assets/White-Incon.png')" alt="" style="height: 50px;">
        </q-toolbar-title>

        <div class="row " style="margin-right: 20%; width: 500px">
          <div class="col-3" style="margin-right: 50px">
            <p>Categories</p>
            <p><a href="">Insurance</a></p>
            <p><a href="">Services</a></p>
            <p><a href="">Travel</a></p>
            <p><a href="">Products</a></p>
            <p><a href="">Shops</a></p>
            <p><a href="">Appliances</a></p>

          </div>
          <div class="col-3">
            <p>Social</p>
            <p><a href="">Facebook</a></p>
            <p><a href="">Instagram</a></p>
            <p><a href="">LinkedIn</a></p>
          </div>
          <div class="col">
            <q-input dark dense standout v-model="search2" input-class="text-right" class="q-ml-md" @keyup.enter="$router.push(`/allproducts/${search2}`)">
              <template v-slot:append>
                <q-icon v-if="search2 === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="search2 = ''" />
              </template>
            </q-input>
          </div>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',
  mounted () {
    this.$binding('categories', this.$fbFirestore.collection('categories'))
  },
  data () {
    return {
      categories: [],
      leftDrawerOpen: false,
      search: '',
      search2: '',
    }
  },
  computed: {
    user () {
      console.log(this.$store,' store')
      return this.$store.getters['BackendModule/getUser']
    }
  },
  methods: {
    searchProduct () {
      this.$router.push(`/allproducts/${this.search}`)
      // this.search = ''
      this.$forceUpdate()
    },
    signOut () {
      this.$store.dispatch('BackendModule/signOut')
        .then(()=> {
          this.$q.notify({
            message: 'Signout Successful',
            icon: 'info',
            color: 'positive'
          })
          this.$forceUpdate()
          this.$router.push('/')
        })
    },
    test () {
      console.log(this.$store)
    },
    toClaimListing () {
      if (this.user) {
        this.$router.push('/claimlisting')
      } else {
        this.$router.push('/signin')
      }
    },
    toRequestQuote () {
      if (this.user) {
        this.$router.push('/requestquote')
      } else {
        this.$router.push('/signin')
      }
    }
  }
}
</script>
<style lang="stylus">
a {
  display:block;
  color:#FFFFFF;
  text-decoration:none
}

span {
  cursor: pointer
}

</style>
