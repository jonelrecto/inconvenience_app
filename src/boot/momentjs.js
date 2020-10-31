// import something here
import moment from 'moment'

// "async" is optional
export default async ({ Vue }) => {
  // something to do
  moment.defaultFormat = 'MM-D-YYYY HH:mm'
  Vue.prototype.$moment = moment
}
