<template>
  <div class="hello row">
    <div class="col-md-6">
      <el-date-picker
        v-model="event.datetime"
        type="datetime">
      </el-date-picker>
    </div>

    <!--<n3-form ref='form' class="hello-form col-md-6">
      <h1>Add event</h1>
      <n3-form-item need>
        <label>Title</label>
        <n3-input name="title" v-model="event.title" :rules="[{type:'required'}]">
        </n3-input>
      </n3-form-item>
      <n3-form-item>
        <label>Description</label>
        <n3-textarea name="description" v-model="event.description">
        </n3-textarea>
      </n3-form-item>
      <n3-form-item need>
        <label>Start from</label>
        <el-date-picker
          v-model="event.datetime"
          type="datetime"
          placeholder="Select date and time">
        </el-date-picker>
      </n3-form-item>
      <n3-form-item need>
        <label>Period (days)</label>
        <n3-input-number v-model="event.period"></n3-input-number>
      </n3-form-item>
      <n3-form-item>
        <n3-button type="primary" @click.native="submit">submit</n3-button>
      </n3-form-item>
    </n3-form>-->
    <div class="col-md-6">
      <h1>Plans for the day</h1>
      <ul class="list-group">
        <li class="list-group-item" v-for="event in events">{{ event.description }}</li>
      </ul>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import moment from 'moment';
  export default {
    name: 'hello',
    data () {
      return {
        event: {
          description: '',
          period: 0,
          datetime: ''
        },
        events: []
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
