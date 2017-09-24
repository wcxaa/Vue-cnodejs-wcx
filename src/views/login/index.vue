<template>
    <div class="wrapper">
        <input class="token" type="text" v-model="token" placeholder="Access Token" maxlength="36">
        <button class="btn" @click="login">登录</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            token: ''
        }
    },
    methods: {
        async login() {
            this.token = this.token.trim()
            if (!this.token) {
                this.$alert('令牌格式错误,应为36位UUID字符串')
                return false
            }

            let res = null
            try {
                res = await this.$http.post('accesstoken', {
                    accesstoken: this.token
                })

                let user = {
                    loginname: res.body.loginname,
                    avatar_url: res.body.avatar_url,
                    id: res.body.id,
                    token: this.token
                }

                this.$store.commit('user/setUserInfo', user)

            } catch (res) {
                this.$alert(res.body.error_msg)
                return false
            }

            let redirect = decodeURIComponent(this.$route.query.redirect || '/')

            this.$router.push({
                path: redirect
            })


        }
    }

}
</script>

<style lang="less" scoped>
@import '~@less/variables.less';

.wrapper {
    padding: 50px @paddingSpace;

    .token {
        display: block;
        width: 100%;
        margin: 15px 0;
        padding: 12px 0;
        font-size: 0.9rem;
        border: none;
        border-bottom: 1px solid @green;
    }
    .btn {
        width: 100%;
        font-size: 1rem;
        line-height: 2.5rem;
        color: #fff;
        background-color: @green;
        border: none;
        border-radius: 4px;
    }
}
</style>
