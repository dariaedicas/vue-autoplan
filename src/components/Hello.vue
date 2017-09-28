<template>
  <div class="hello row">
    <div class="col-md-8">
      <div class="plans">
        <div id="pin"></div>
        <!--TODO::do something with checking expired-->
        <transition-group name="list" tag="ul" class="list-group">
          <li id="todo" :key="'todo'"></li>
          <li :key="event._id" class="list-group-item event-item" v-for="(event, index) in events"
              v-bind:class="{expired: new Date(event.datetime) < new Date(),
            'expired-today': new Date(event.datetime) < new Date() &&  new Date(event.datetime) >= start,
             active: event == selectedEvent}">
            <i class="el-icon-information"></i>
            <el-checkbox v-model="event.is_done" class="event-title" v-bind:class="{done: event.is_done }"
                         @change="done(event)"> {{ event.title }}
            </el-checkbox>
            <div class="controls">
              <el-button class="el-icon-edit" @click="edit(event)"></el-button>
              <el-button class="el-icon-delete" @click="remove(event, index)"></el-button>
            </div>
          </li>
        </transition-group>
        </ul>
      </div>
    </div>
    <el-form :model="newEvent" :rules="rules" ref="formEvent" label-position="top" class="col-md-4 event-form">
      <el-form-item label="Title" prop="title" required>
        <el-input v-model="newEvent.title"></el-input>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input type="textarea" v-model="newEvent.description"></el-input>
      </el-form-item>
      <el-form-item label="Should be done by" prop="datetime" required>
        <el-date-picker type="datetime" v-model="newEvent.datetime"
                        format="dd-MM-yyyy HH:mm"
                        :clearable="false"
                        :picker-options="{firstDayOfWeek: 1}"></el-date-picker>
      </el-form-item>
      <el-form-item label="Repeat every" prop="period" class="period">
        <el-input-number v-model="newEvent.period"></el-input-number>
        days
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit('formEvent')">{{editing ? 'Update' : 'Create'}}</el-button>
        <el-button v-if="editing" type="warning" @click="cancel(newEvent)">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
  import moment from 'moment';
  import Vue from 'vue';
  export default {
    name: 'hello',
    data () {
      return {
        start: moment().startOf('day'),
        end: moment().endOf('day'),
        editing: false,
        newEvent: {
          title: '',
          description: '',
          period: 0,
          datetime: new Date(moment().endOf('day'))
        },
        selectedEvent: false,
        events: [],
        rules: {
          title: [
            {required: true, message: 'Please input title', trigger: 'blur'},
          ],
          datetime: [
            {type: 'date', required: true, message: 'Please pick a date and a time', trigger: 'change'}
          ]
        }
      }
    },
    created: function () {
      this.fetchItems();
    },
    methods: {
      moment: function () {
        return moment()
      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let uri = 'http://localhost:4000/events/add';
            this.axios.post(uri, this.newEvent).then((response) => {
              console.log(response);
              this.$refs[formName].resetFields();
              this.fetchItems();
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      fetchItems()
      {
        let uri = 'http://localhost:4000/events';
        this.axios.get(uri).then((response) => {
          this.events = response.data;
        }).catch(() => {
          this.$notify({
            title: 'Error',
            message: "Can't get events list",
            type: 'error'
          });
        })
      },
      done(event){
        console.log(event);
        let uri = 'http://localhost:4000/events/done/' + event._id;
        this.axios.post(uri, event).then(() => {
          this.fetchItems();
        }).catch(() => {

        });
      },
      edit(event){
        event.datetime = new Date(event.datetime);
        this.newEvent = Vue.util.extend({}, event);
        this.selectedEvent = event;
        this.editing = true;
      },
      cancel(){
        this.editing = false;
        this.selectedEvent = false;
        //  this.newEvent  =  this.selectedEvent;
        this.$refs['formEvent'].resetFields();
      },
      remove(event, idx) {
        this.$confirm('This will delete the event ' + event.title, 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let uri = 'http://localhost:4000/events/delete/' + event._id;
          this.axios.get(uri).then(() => {
            this.events.splice(idx, 1);
            this.$notify({
              title: 'Removed',
              message: event.title + ' was removed',
              type: 'success'
            });
          }).catch(() => {
            this.$notify({
              title: 'Error',
              message: event.title + ' was not removed',
              type: 'error'
            });
          });
        }).catch(() => {
          this.$notify.info({
            title: 'Canceled',
            message: event.title + ' deletion was canceled'
          });
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import './hello/hello.css';
</style>
