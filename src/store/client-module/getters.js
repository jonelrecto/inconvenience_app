export const getImage = () => (url) => {
  // return  url ? 'http://localhost:3030/uploads/' + url.replace('public\\uploads\\', '') : require('../../assets/empty-image.png')
}

export const getNewCompanyDialog = (state) => {
  return state.newCompanyDialog
}