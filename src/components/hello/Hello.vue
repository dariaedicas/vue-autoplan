<template>
    <div class="hello row">
        <div id="pin"></div>
        <div class="plans">
            <div class="plans-header">
                <div id="todo"></div>
                <i class="el-icon-plus create-event" @click="eventDialogVisible = true"></i>
                <i v-if="isFuture" class="el-icon-d-arrow-left future-events" @click="fetchItems()"></i>
                <i v-if="!isFuture" class="el-icon-d-arrow-right future-events" @click="showFuture()"></i>
            </div>
            <transition-group name="list" tag="ul" class="list-group">
                <li :key="event._id" class="list-group-item event-item" v-for="(event, index) in events"
                    v-bind:class="{expired: new Date(event.datetime) < new Date(),
                        'expired-today': isExpiredToday(event)}">
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
                        <el-button class="el-icon-delete" @click="deleteEvent(event, index)"></el-button>
                    </div>
                </li>
            </transition-group>
        </div>
        <el-dialog
                :custom-class="'create-event-dialog'"
                :visible.sync="eventDialogVisible"
                size="tiny"
                :show-close="false"
                :before-close="handleEventDialogClose">
            <event-dialog
                    :editing="editing"
                    :newEvent="newEvent"
                    v-on::updateItems="fetchItems"
                    v-on:closeDialog="handleEventDialogClose">
            </event-dialog>
        </el-dialog>
        <el-dialog
                :title="'Have '+doneEvent.title + ' is done by?'"
                :visible.sync="dialogVisible"
                size="tiny"
                :before-close="handleDoneClose">
            <el-form ref="doneDatetime">
                <el-form-item prop="doneDatetime" required>
                    <el-date-picker type="datetime" v-model="doneDatetime"
                                    format="dd-MM-yyyy HH:mm"
                                    :clearable="false"
                                    :picker-options="{firstDayOfWeek: 1}">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleDoneClose()">Cancel</el-button>
                <el-button type="primary" @click="confirmDoneDate()">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
    import moment from 'moment';
    import Vue from 'vue';
    import eventDialog from '../eventDialog/dialog.vue';
    import EventDialog from "../eventDialog/dialog";
    export default {
        components: {
            EventDialog,
            'event-dialog': eventDialog
        },
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
                eventDialogVisible: false,
                editing: false,
                newEvent: {
                    title: '',
                    description: '',
                    period: 0,
                    datetime: new Date(moment().endOf('day'))
                },
                dialogVisible: false,
                start: moment().startOf('day'),
                end: moment().endOf('day'),
                doneEvent: false,
                doneDatetime: new Date(),
                events: [],
                isFuture: false
            }
        },
        created: function () {
            this.fetchItems();
        },
        methods: {
            handleEventDialogClose(){
                this.eventDialogVisible=false
                this.editing=false;
                this.newEvent={
                    title: '',
                    description: '',
                    period: 0,
                    datetime: new Date(moment().endOf('day'))
                }
            },
            isToday: function (event) {
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
            handleDoneClose(){
                this.dialogVisible = false;
                this.doneEvent.is_done = false;
                this.$notify.info({
                    title: 'Canceled',
                    message: 'Doing ' + this.doneEvent.title + ' was canceled'
                });
            },
            confirmDoneDate(){
                this.dialogVisible = false;
                let event = this.doneEvent;
                this.doneEvent.done_datetime = this.doneDatetime;
                let uri = 'http://localhost:4000/events/done/' + event._id;
                this.axios.post(uri, event).then(() => {
                    this.$notify({
                        title: 'Done',
                        message: event.title + ' was done',
                        type: 'success'
                    });
                    this.fetchItems();
                }).catch(() => {
                    event.is_done = false;
                    this.$notify({
                        title: 'Error',
                        message: event.title + ' was not done',
                        type: 'error'
                    });
                });
            },
            done(event){
                this.dialogVisible = true;
                this.doneEvent = event;
                this.doneDatetime = new Date();
            },
            edit(event){
                event.datetime = new Date(event.datetime);
                this.newEvent = Vue.util.extend({}, event);
                this.editing = true;
                this.eventDialogVisible = true;
            },

            deleteEvent(event, idx) {
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
    @import 'hello.css';
</style>
