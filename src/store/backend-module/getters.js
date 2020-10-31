export const isLoggedIn = (state) => {
  return !!state.token
}

export const authStatus = (state) => {
  return state.status
}

export const getUser = (state) => {
	return state.user
}


export function getCategoryFilter (state) {
  return state.categoryFilter
}

export function getTabState (state) {
  return state.tabState
}

export const getPlainValue = (state) => (dataObject) => {
	var obj = JSON.parse(JSON.stringify(dataObject));
	Object.keys(obj).reduce(function (obj, key) {
	  if (obj["_" +  key] === obj[key]) {
	    delete obj["_" +  key]
	  }
	  return obj
	}, obj)
	return obj
}