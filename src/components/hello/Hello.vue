<template>
    <div class="hello row">
        <div class="col-md-8">
        <div id="pin"></div>
        <div class="plans">
            <div class="plans-header">
                <div id="todo"></div>
                <i v-if="isAuthenticated" class="el-icon-plus create-event custom-icon" @click="eventDialogVisible = true"></i>
                <i v-if="isFuture" class="el-icon-d-arrow-left future-events custom-icon" @click="fetchItems()"></i>
                <i v-if="!isFuture" class="el-icon-d-arrow-right future-events custom-icon" @click="showFuture()"></i>
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
        </div>
        <div class="col-md-4">
            <button @click="authenticate('facebook')" v-if="!isAuthenticated">Login with Facebook</button>
            <button @click="logout()" v-if="isAuthenticated">Logout</button>
    </div>
        <el-dialog
                :custom-class="'create-event-dialog'"
                :visible.sync="eventDialogVisible"
                size="tiny"
                :before-close="handleEventDialogClose">
            <event-dialog
                    :editing="editing"
                    :newEvent="newEvent"
                    v-on:updateItems="fetchItems"
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
                isAuthenticated: this.$auth.isAuthenticated(),
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
            authenticate(provider){
                this.$auth.authenticate(provider).then((response) => {
                    return this.axios.get('https://graph.facebook.com/v2.4/me', {
                        params: {
                            access_token: response.data.access_token,
                            fields: 'id,name,short_name,name_format,first_name,middle_name,last_name,gender,email,verified,is_verified,cover,picture,timezone,currency,locale,age_range,updated_time,link,devices,is_shared_login,can_review_measurement_request',
                        },
                    })
                }).then((response) => {
                    this.isAuthenticated =true;
                    localStorage.setItem('user_id', response.data.id);
                    this.fetchItems();
                }).catch(function (err) {

                })
            },
            logout() {
                this.isAuthenticated =false;
                this.$auth.logout();
                localStorage.removeItem('user_id');
                this.fetchItems();
            },
            handleEventDialogClose(){
                this.eventDialogVisible=false;
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
                if(!this.getUserId()){
                    return;
                }
                let uri = process.env.API_SERVER+'events/future/'+this.getUserId();
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
            getUserId: function(){
                if(!localStorage.getItem('user_id')){
                    this.$notify({
                        title: 'Error',
                        message: 'Please log in!',
                        type: 'error'
                    });
                    return false;
                } else{
                    return localStorage.getItem('user_id');
                }
            },
            fetchItems(){
                if(!this.getUserId()){
                    return;
                }
                let uri = process.env.API_SERVER+'events/'+this.getUserId();
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
                let uri = process.env.API_SERVER+'events/done/' + event._id;
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
                    let uri = process.env.API_SERVER+'events/delete/' + event._id;
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
