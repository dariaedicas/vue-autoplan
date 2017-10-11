<template>
    <a :href="apiUrl+'auth/facebook'" target="_self" class="btn btn-default">Login with Facebook</a>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'Login',
        data () {
            return {
                apiUrl: process.env.API_SERVER,
            }
        },
        methods: {
            login(provider){
                let uri = process.env.API_SERVER + 'auth/' + provider;
                this.axios.get(uri).then((response) => {
                }).catch(() => {
                    this.$notify({
                        title: 'Error',
                        message: "Can't login",
                        type: 'error'
                    });
                })
            }
        }
    }
</script>