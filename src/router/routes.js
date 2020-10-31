
const routes = [
  {
    path: '/',
    component: () => import('layouts/Webpage.vue'),
    children: [
      { name: 'homepage', path: '', component: () => import('pages/Homepage.vue') },
      { name: 'archive', path: '/archive/:categoryId', component: () => import('pages/Archive.vue') },
      { name: 'aboutus', path: '/aboutus', component: () => import('pages/AboutUs.vue') },
      { name: 'contactus', path: '/contactus', component: () => import('pages/ContactUs.vue') },
      { name: 'claimlisting', meta: { requiredAuth: true }, path: '/claimlisting', component: () => import('pages/ClaimListingForm.vue') },
      { name: 'singlelisting', path: '/singlelisting/:productId', component: () => import('pages/SingleListing.vue') },
      { name: 'unrecommend',meta: { requiredAuth: true }, path: '/unrecommend', component: () => import('pages/UnrecommendBusiness.vue') },
      { name: 'requestquote',meta: { requiredAuth: true }, path: '/requestquote', component: () => import('pages/RequestQuote.vue') },
      { name: 'complainthere',  meta: { requiredAuth: true }, path: '/complainthere', component: () => import('pages/ComplaintHere.vue') },
      { name: 'signup', path: '/signup', component: () => import('pages/Signup.vue') },
      { name: 'signin', path: '/signin', component: () => import('pages/Signin.vue') },
      { name: 'allproducts', path: '/allproducts', component: () => import('pages/AllProducts.vue') },
      { name: 'allproductsearch', path: '/allproducts/:searchKey', component: () => import('pages/ProductFilter.vue') },
      { name: 'userprofile',meta: { requiredAuth: true }, path: '/profile', component: () => import('pages/UserProfile.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/BackendPage.vue'),
    children: [
      { path: '/', meta: { requiredAuth: true }, component: () => import('pages/backendpages/ArchiveList.vue') },
      { path: '/admin/requestedquotes', meta: { requiredAuth: true }, component: () => import('pages/backendpages/RequestedQuotes.vue') },
      { path: '/admin/claimlistingusers', meta: { requiredAuth: true }, component: () => import('pages/backendpages/ClaimListingUsers.vue') },
      { path: '/admin/users', meta: { requiredAuth: true }, component: () => import('pages/backendpages/Users.vue') },
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/Login.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
