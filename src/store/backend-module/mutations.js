import Vue from 'vue'

export const auth_request = (state) => {
  state.status = 'loading'
}

export const auth_success = (state, {token, user}) => {
    localStorage.setItem('token', token)
    state.token = token
    state.user = user
  
}

export const update_userData = (state, {userData}) => {
  state.user.userData = userData
}

export const auth_error = (state) => {
  state.status = 'error'
}

export const logout = (state) => {
  state.status = ''
  state.token = ''
  state.user = null
}

export function setCategoryFilter (state, payload) {
  state.categoryFilter = payload
}
export function setTabState (state, payload) {
  state.tabState = payload
}
