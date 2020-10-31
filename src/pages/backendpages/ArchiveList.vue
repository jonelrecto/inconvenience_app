<template>
  <q-page padding>
    <q-page-sticky expand position="top">
      <q-toolbar class="flex flex-center bg-white q-px-xl">
        <q-tabs
          v-model="tab"
        >
          <q-tab name="categories" label="Categories" />
          <q-tab name="products" label="Products" />
          <q-tab name="companies" label="Companies" />
        </q-tabs>
      </q-toolbar>
    </q-page-sticky>

    <div style="margin-top: 50px; ">
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="categories">
          <div class="text-h4 q-mb-md">Categories</div>
          <category-list></category-list>
        </q-tab-panel>

        <q-tab-panel name="products">
          <div class="text-h4 q-mb-md">Product List</div>
          <product-list></product-list>
        </q-tab-panel>

        <q-tab-panel name="companies">
          <div class="text-h4 q-mb-md">Companies</div>
          <!-- <product-list></product-list> -->
          <company-list></company-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>
<script>
import CategoryList from '../../components/backend-components/CategoryList'
import ProductList from '../../components/backend-components/ProductList'
import CompanyList from '../../components/backend-components/CompanyList'

export default {
  components: {
    CategoryList,
    ProductList,
    CompanyList
  },
  computed: {
    tab: {
      get () {
        return this.$store.getters['BackendModule/getTabState']
      },
      set (v) {
        this.$store.commit('BackendModule/setTabState', v)
      }
    }
  },
  data () {
    return {
      // tab: 'categories'
    }
  }
}
</script>

<style lang="sass">
</style>