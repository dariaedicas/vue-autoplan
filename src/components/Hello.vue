<template>
  <div class="hello row">
    <n3-form ref='form' class="hello-form col-md-6">
      <n3-form-item need>
        <label>Description</label>
        <n3-input name="description" v-model="event.description" :rules="[{type:'required'}]">
        </n3-input>
      </n3-form-item>
      <n3-form-item need>
        <label>Datetime</label>
        <n3-datetimepicker v-model="event.datetime" :readonly="false" format="yyyy-MM-dd hh:mm"></n3-datetimepicker>
      </n3-form-item>
      <!--      <n3-select v-model="selected" :options="someOptions">
            </n3-select>-->
      <n3-form-item need>
        <label>Period</label>
        <n3-input-number v-model="event.period"></n3-input-number>
      </n3-form-item>
      <n3-form-item>
        <n3-button type="primary" @click.native="submit">submit</n3-button>
      </n3-form-item>
    </n3-form>
    <div class="col-md-6">
      <h1>Plans for the day</h1>
      <ul class="list-group">
        <li class="list-group-item" v-for="event in events">{{ event.description }}</li>
      </ul>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import moment from 'moment'
  export default {
    name: 'hello',
    data () {
      return {
        someOptions: [
          {value: 'apple', label: 'Apple'},
          {value: 'banana', label: 'Banana'},
          {value: 'cherry', label: 'Cherry'},
          {value: 'orange', label: 'Orange'},
          {value: 'grape', label: 'Grape'}
        ],
        event: {
          description: '',
          period: '',
          datetime: moment().format('YYYY-MM-DD hh:mm')
        },
        events: [],
        selected: ''
      }
    },
    created: function () {
      this.fetchItems();
    },
    methods: {
      moment: function () {
        return moment()
      },
      submit: function () {
        var self = this;
        this.$refs.form.validateFields(function (result) {
          console.log(self.event, new Date(self.event.datetime).toISOString());
          let uri = 'http://localhost:4000/events/add';
          /*   self.event.datetime = new Date(self.event.datetime);*/
          self.axios.post(uri, self.event).then((response) => {
            console.log(response)
          })
        })
      },
      fetchItems()
      {
        let uri = 'http://localhost:4000/events';
        this.axios.get(uri).then((response) => {
          this.events = response.data;
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import './hello/hello.css';

  .hello-form {
    max-width: 300px;
  }
</style>
