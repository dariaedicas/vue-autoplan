import moment from 'moment'

export default {
  formatDate: function (value, format) {
    if (value) {
      return moment(String(value)).format(format)
    }
  }
};
