<template>
  <div class="hello row">
    <div class="col-md-8">
      <div id="pin"></div>
      <div class="plans">
        <div class="plans-header">
          <div id="todo"></div>
          <i v-if="isFuture" class="el-icon-d-arrow-left future-events" @click="fetchItems()"></i>
          <i v-if="!isFuture" class="el-icon-d-arrow-right future-events" @click="showFuture()"></i>
        </div>
        <transition-group name="list" tag="ul" class="list-group">
          <li :key="event._id" class="list-group-item event-item" v-for="(event, index) in events"
              v-bind:class="{expired: new Date(event.datetime) < new Date(),
               'expired-today': isExpiredToday(event),
                active: event == selectedEvent}">
            <i class="el-icon-information"></i>
            <el-checkbox v-model="event.is_done" class="event-title"
                         v-bind:class="{done: event.is_done }"
                         @change="done(event)">
            </el-checkbox>
            <span class="title">
              <span v-if="isToday(event)" class="date">{{event.datetime | formatDate('HH:mm')}} </span>
              <span v-if="!isToday(event)" class="date">{{event.datetime | formatDate('DD-MM-YYYY')}}</span>
              - {{ event.title }}
            </span>
            <div class="controls">
              <el-button class="el-icon-edit" @click="edit(event)"></el-button>
              <el-button class="el-icon-delete" @click="remove(event, index)"></el-button>
            </div>
          </li>
        </transition-group>
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
    <el-dialog
      title="Tips"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose">
      <el-form-item label="Was done" prop="datetime" required>
        <el-date-picker type="datetime" v-model="done_datetime"
                        format="dd-MM-yyyy HH:mm"
                        :clearable="false"
                        :picker-options="{firstDayOfWeek: 1}"></el-date-picker>
      </el-form-item>
  <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import moment from 'moment';
  import Vue from 'vue';
  export default {
    filters: {
      formatDate: function (value, format) {
        if (value) {
          return moment(String(value)).format(format)
        }
      }
    },
    name: 'hello',
    data () {
      return {
        dialogVisible: false,
        start: moment().startOf('day'),
        end: moment().endOf('day'),
        editing: false,
        done_datetime: new Date(),
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
        },
        isFuture: false,
        doneEvent: false
      }
    },
    created: function () {
      this.fetchItems();
    },
    methods: {
      isToday: function(event){
        return new Date(event.datetime) <= this.end && new Date(event.datetime) >= this.start
      },
      isExpiredToday: function (event) {
        return new Date(event.datetime) < new Date() && new Date(event.datetime) >= this.start
      },
      showFuture: function () {
        let uri = 'http://localhost:4000/events/future';
        this.axios.get(uri).then((response) => {
          this.events = response.data;
          this.isFuture = true;
        }).catch(() => {
          this.$notify({
            title: 'Error',
            message: "Can't get events list",
            type: 'error'
          });
        })
      },
      moment: function () {
        return moment()
      },
      submit(formName) {
        let uri = 'http://localhost:4000/events/add';
        let action = 'create';
        if (this.newEvent._id) {
          uri = 'http://localhost:4000/events/update/' + this.newEvent._id;
          action = 'update';
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(uri, this.newEvent).then(() => {
              this.editing = false;
              this.$notify({
                title: 'Success',
                message: this.newEvent.title + ' was ' + action + 'd',
                type: 'success'
              });
              //TODO::create separate method
              this.$refs[formName].resetFields();
              this.newEvent = {
                title: '',
                description: '',
                period: 0,
                datetime: new Date(moment().endOf('day'))
              };
              this.fetchItems();
            }).catch(() => {
              this.$notify({
                title: 'Error',
                message: "Can't " + action,
                type: 'error'
              });
            })
          } else {
            this.editing = false;
            return false;
          }
        });
      },
      fetchItems(){
        let uri = 'http://localhost:4000/events';
        this.axios.get(uri).then((response) => {
          this.events = response.data;
          this.isFuture = false;
        }).catch(() => {
          this.$notify({
            title: 'Error',
            message: "Can't get events list",
            type: 'error'
          });
        })
      },
      handleClose(done) {
        done();
        let event = this.doneEvent;
        let uri = 'http://localhost:4000/events/done/' + event._id;
        this.axios.post(uri, event).then(() => {
          this.$notify({
            title: 'Done',
            message: event.title + ' was done',
            type: 'success'
          });
          this.fetchItems();
        }).catch(() => {
          done();
          event.is_done = false;
          this.$notify({
            title: 'Error',
            message: event.title + ' was not done',
            type: 'error'
          });
        });
      },
      done(event){
        this.$confirm('Have you really done this? ' + event.title, 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.dialogVisible = true;
          this.doneEvent = event;
        }).catch(() => {
          event.is_done = false;
          this.$notify.info({
            title: 'Canceled',
            message: 'Doing ' + event.title + ' was canceled'
          });
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
        this.newEvent = {
          title: '',
          description: '',
          period: 0,
          datetime: new Date(moment().endOf('day'))
        };
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
            message: 'Deleting ' + event.title + ' was canceled'
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
