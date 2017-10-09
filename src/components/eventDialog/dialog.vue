<template>
        <el-form :model="newEvent" :rules="rules" ref="formEvent" label-position="top" class="event-form">
            <el-form-item prop="title" required class="title">
                <el-input v-model="newEvent.title" placeholder="Title"></el-input>
            </el-form-item>
            <el-form-item prop="description">
                <el-input type="textarea" v-model="newEvent.description" placeholder="Description"></el-input>
            </el-form-item>
            <el-form-item label="Should be done by" prop="datetime" required>
                <el-date-picker type="datetime" v-model="newEvent.datetime"
                                format="dd-MM-yyyy HH:mm"
                                :clearable="false"
                                :picker-options="{firstDayOfWeek: 1}">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="Repeat every" prop="period" class="period">
                <el-input-number v-model="newEvent.period"></el-input-number>
                days
            </el-form-item>
            <el-form-item class="controls">
                <el-button type="primary" @click="createEvent('formEvent')">{{editing ? 'Update' : 'Create'}}
                </el-button>
                <el-button v-if="editing" type="warning" @click="$emit('closeDialog');">Cancel</el-button>
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
                let uri = 'http://localhost:4000/events/add';
                let action = 'create';
                if (this.newEvent._id) {
                    uri = 'http://localhost:4000/events/update/' + this.newEvent._id;
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