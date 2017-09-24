<template>
    <div class="replyInput">
        <textarea class="text" v-model="reply" placeholder="回复支持Markdown语法，请注意标记代码" rows="8" ref="input"></textarea>
        <button class="btn" @click="addReply">
            <span v-if="!loading">确定</span>
            <loading-span v-if="loading" class="loading"></loading-span>
        </button>
    </div>
</template>

<script>
import { linkUsers } from '@js/utils'
import LoadingSpan from '@/components/loading-span'

export default {
    props: {
        topicId: {
            type: String,
            required: true
        },
        replyId: String,
        replyTo: String
    },
    data() {
        return {
            loading: false,
            reply: ''
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo
        }
    },
    methods: {
        async addReply() {

            if (this.loading) return

            if (!this.reply) {
                this.$alert('请输出评论内容')
                return false
            }

            this.loading = true
            try {
                let content = linkUsers(this.reply)
                await this.$http.post(`topic/${this.topicId}/replies`, {
                    accesstoken: this.userInfo.token,
                    content: content,
                    reply_id: this.replyId
                })
                this.reply = ''
                this.$emit('success')
            } catch (err) {
                console.log(err)
                this.$alert('新建评论出错，请稍后再试')
            }

            this.loading = false
        }
    },
    mounted() {
        if (this.replyTo) {
            this.reply = `@${this.replyTo} `
            this.$refs.input.focus()
        }

    },
    components: {
        LoadingSpan
    }
}
</script>


<style lang="less" scoped>
@import '~@less/variables.less';

.replyInput {
    padding: 15px @paddingSpace;

    .text {
        display: block;
        width: 100%;
        padding: 15px;
        border: 1px solid #d5dbdb;
    }
    .btn {
        margin-top: 15px;
        padding: 8px 0;
        width: 100%;
        font-size: 1.1rem;
        color: #fff;
        background-color: @green;
        border: none;
        border-bottom: 2px solid #3aa373;

        .loading {
            color: #fff;
        }
    }
}
</style>
