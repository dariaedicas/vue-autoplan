<template>
        <el-form :model="newEvent" :rules="rules" ref="formEvent" label-position="top" class="event-form">
            <el-form-item label='Title' prop="title" required class="title">
                <el-input v-model="newEvent.title" placeholder="Title"></el-input>
            </el-form-item>
            <el-form-item prop="description">
                <el-input type="textarea" v-model="newEvent.description" placeholder="Description"></el-input>
            </el-form-item>
            <el-form-item class="datetime" label="Should be done by" prop="datetime" required>
                <el-date-picker type="datetime" v-model="newEvent.datetime"
                                format="dd-MM-yyyy HH:mm"
                                :clearable="false"
                                :picker-options="{firstDayOfWeek: 1}">
                </el-date-picker>
                <i class="el-icon-check create-event-form-item" @click="createEvent('formEvent')"></i>
            </el-form-item>
            <div class="clearfix"></div>
            <el-form-item label="Repeat every" prop="period" class="period">
                <el-input-number v-model="newEvent.period"></el-input-number>
                days
            </el-form-item>
        </el-form>
</template>

<script type="text/ecmascript-6">
    import moment from 'moment';
    import Vue from 'vue';
    export default {
        name: 'eventDialog',
        props: ['editing', 'newEvent'],
        data () {
            return {
                rules: {
                    title: [
                        {required: true, message: 'Please input title', trigger: 'blur'},
                    ],
                    datetime: [
                        {type: 'date', required: true, message: 'Please pick a date and a time', trigger: 'change'}
                    ]
                },
            }
        },
        methods: {
            createEvent(formName) {
                let uri = process.env.API_SERVER+'events/add';
                let action = 'create';
                if (this.newEvent._id) {
                    uri = process.env.API_SERVER+'events/update/' + this.newEvent._id;
                    action = 'update';
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post(uri, this.newEvent).then(() => {
                            this.$notify({
                                title: 'Success',
                                message: this.newEvent.title + ' was ' + action + 'd',
                                type: 'success'
                            });
                            this.$emit('closeDialog');
                            this.$emit('updateItems');
                        }).catch((er) => {
                            console.log(er);
                            this.$notify({
                                title: 'Error',
                                message: "Can't " + action,
                                type: 'error'
                            });
                        })
                    } else {
                        return false;
                    }
                });
            },
        }
    }
</script>
<style scoped>
    @import 'dialog.css';
</style>