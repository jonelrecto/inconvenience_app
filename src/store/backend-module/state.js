export default {
  status: null,
  user: null,
  token: localStorage.getItem('token') || '',
  categoryFilter: {
    label: 'All',
    value: 'all'
  },
  tabState: 'categories'
}
