<template>
    <div>
        <loading v-if="loading"></loading>
        <error v-if="error" :err="error"></error>
        <div v-if="!loading&&!error">
            <section class="message-part">
                <div class="message-nav">
                    <span class="item" :class="{active: activeMessageNav===MESSAGE_NOT_READ}" @click="setMessageNav(MESSAGE_NOT_READ)">
                        未读消息
                        <span class="messageNotReadCount" v-if="messageNotReadCount>0">{{messageNotReadCount}}</span>
                    </span>
                    <span class="item" :class="{active: activeMessageNav===MESSAGE_HAS_READ}" @click="setMessageNav(MESSAGE_HAS_READ)">已读消息</span>
                </div>
                <ul class="message-list">
                    <li class="message" v-for="message in messageList" :key="message.id" @click="markAndGo(message.topic.id, message.id)">
                        <div class="top">
                            <span class="text">
                                <img class="avatar" :src="message.author.avatar_url" alt="avatar"> {{message.author.loginname}}
                                <span v-if="message.type==='reply'">回复了您的话题：</span>
                                <span v-if="message.type==='at'">在回复中@了您：</span>
                            </span>
                            <span class="time">{{message.reply.create_at | getTimeago}}</span>
                        </div>
                        <div class="content" v-html="message.reply.content"></div>
                        <div class="topic">
                            话题：{{message.topic.title}}
                        </div>
                    </li>
                </ul>
                <div class="no-data" v-if="!messageList.length">
                    暂无数据
                </div>
            </section>
        </div>
    </div>
</template>

<script>
const MESSAGE_HAS_READ = Symbol('message_has_read')
const MESSAGE_NOT_READ = Symbol('message_not_read')

export default {
    data() {
        return {
            loading: false,
            error: null,

            activeMessageNav: undefined,
            myMessage: {},
            messageList: [],

            MESSAGE_HAS_READ,
            MESSAGE_NOT_READ
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo
        },
        messageNotReadCount() {
            return this.myMessage[this.getMessageKeyName(MESSAGE_NOT_READ)].length
        }
    },
    methods: {
        async getMyMessage() {
            this.loading = true
            this.error = null

            let res
            try {
                res = await this.$http.get('messages', {
                    params: {
                        accesstoken: this.userInfo.token
                    }
                })

                this.myMessage = res.body.data
            } catch (res) {
                this.error = res
            }

            this.loading = false
        },
        getMessageKeyName(tab) {
            let keyName = ''
            switch (tab) {
                case MESSAGE_HAS_READ:
                    keyName = 'has_read_messages'
                    break;
                case MESSAGE_NOT_READ:
                    keyName = 'hasnot_read_messages'
                    break;
            }
            return keyName
        },
        setMessageNav(tab) {
            this.activeMessageNav = tab

            this.messageList = this.myMessage[this.getMessageKeyName(tab)]
        },
        async markAndGo(topicId, msgId) {
            if (this.activeMessageNav === MESSAGE_NOT_READ) {
                try {
                    await this.$http.post(`message/mark_one/${msgId}`, {
                        accesstoken: this.userInfo.token
                    })

                    this.$store.commit('message/setMessageNotReadCount', this.messageNotReadCount - 1)
                } catch (err) {
                    this.$alert('标记消息出错，请稍后再试')
                    return
                }
            }

            this.$router.push({
                name: 'topic',
                params: {
                    id: topicId
                }
            })
        }
    },
    async created() {
        await this.getMyMessage()
        this.setMessageNav(MESSAGE_NOT_READ)
    }
}
</script>


<style lang="less" scoped>
@import '~@less/variables.less';

.message-part {
    .message-nav {
        display: flex;
        font-size: 0;

        .item {
            flex-grow: 1;
            display: inline-block;
            padding: 12.5px 0;
            font-size: 1rem;
            font-weight: 700;
            border-left: 1px solid @borderColor;
            border-bottom: 2px solid @borderColor;
            text-align: center;

            &:first-child {
                border-left: none;
            }

            &.active {
                color: #ff5a5f;
                border-bottom-color: #ff5a5f;
            }

            .messageNotReadCount {
                display: inline-block;
                width: 20px;
                height: 20px;
                line-height: 20px;
                color: #fff;
                background-color: @lightGreen;
                text-align: center;
                border-radius: 50%;
            }
        }
    }

    .message-list {
        .message {

            display: block;
            padding: 15px @paddingSpace;
            border-bottom: 1px solid @borderColor;

            .top {
                display: flex;
                justify-content: space-between;

                .text {
                    font-size: 0.9rem;
                    color: @textBaseColorLighter;

                    .avatar {
                        width: 40px;
                        height: 40px;
                        margin-right: 5px;
                        border-radius: 50%;
                        vertical-align: top;
                    }
                }

                .time {
                    font-size: 0.7rem;
                    color: @lightGreen;
                }
            }

            .content {
                padding: 10px 0;
                color: @textBaseColor;
            }

            .topic {
                padding: 5px;
                margin: 5px 0;
                font-size: 1.1rem;
                color: #2c3e50;
                background-color: #f0f0f0;
                border-radius: 5px;
            }
        }
    }

    .no-data {
        padding-top: 80px;
        font-size: 1.5rem;
        color: #999;
        text-align: center;
    }
}
</style>