<template>
    <div>
        <loading v-if="loading"></loading>
        <error v-if="error" :err="error"></error>
        <div v-if="!loading&&!error" ref="page">
            <div class="topic">
                <h2 class="title">
                    {{ topic.title }}
                </h2>
                <div class="info">
                    <div class="left">
                        <router-link class="link" :to="{name:'user',params:{loginname: topic.author.loginname}}">
                            <img class="avatar" :src="topic.author.avatar_url">
                        </router-link>
                        <span class="texts">
                            <span class="name">{{topic.author.loginname}}</span>
                            <time class="create-at">发布于:{{topic.create_at | getTimeago}}</time>
                        </span>
                    </div>
                    <div class="right">
                        <span class="label" :class="[{top:topic.top},{good:topic.good},topic.tab]">{{getTopicLabel(topic.top,topic.good,topic.tab)}}</span>
                        <span class="visit-count">{{topic.visit_count}}次浏览</span>
                    </div>
                </div>
                <div class="content markdown-body" v-html="topic.content"></div>
            </div>
            <section class="section-reply">
                <h3 class="title">
                    <b class="reply-count">{{ topic.reply_count }}</b> 回复
                </h3>
                <ul class="reply-list">
                    <li class="reply" v-for="reply in topic.replies" :key="reply.id">
                        <div class="info">
                            <span class="left">
                                <router-link class="avatar-link" :to="{name: 'user', params:{loginname: reply.author.loginname}}">
                                    <img class="avatar" :src="reply.author.avatar_url">
                                </router-link>
                                <span class="text">{{ reply.author.loginname }} 发布于：<br>{{ reply.create_at | getTimeago}}</span>
                            </span>
                            <span class="right">
                                <span class="iconfont icon-good" :class="{active: hasUped(reply.ups)}" @click="upReply(reply.id)"></span>
                                <span class="up-count">{{ reply.ups.length }}</span>
                                <span class="iconfont icon-reply" @click="addReply(reply.id)"></span>
                            </span>
                        </div>
                        <div class="content markdown-body" v-html="reply.content"></div>
                        <reply v-if="userInfo.id&&currentReply===reply.id" :topic-id="topic.id" :reply-id="reply.id" :reply-to="reply.author.loginname" @success="replySuccess"></reply>
                    </li>
                </ul>
                <reply v-if="userInfo.id" :topic-id="topic.id" @success="replySuccess"></reply>
            </section>
        </div>
    </div>
</template>



<script>
import Reply from '@/components/reply'
import { getTopicLabel } from '@js/utils'

export default {
    data() {
        return {
            loading: false,
            error: null,
            topic: {},
            currentReply: ''
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo
        }
    },
    methods: {
        getTopic() {
            this.loading = true
            this.error = null
            this.$http.get('topic/' + this.topic.id).then((res) => {
                if (res.body.success) {
                    this.topic = res.body.data
                } else {
                    this.error = res
                }
            }).catch((err) => {
                this.error = err
            }).then(() => {
                this.loading = false
            })
        },
        getTopicLabel(top, good, tab) {
            return getTopicLabel(top, good, tab)
        },
        replySuccess() {
            this.getTopic()
            this.currentReply = ''
        },
        async upReply(id) {
            if (!this.userInfo.id) {
                this.$router.push({
                    name: 'login',
                    query: {
                        redirect: encodeURIComponent(this.$route.fullPath)
                    }
                })
                return
            }

            let res
            try {
                res = await this.$http.post(`reply/${id}/ups`, {
                    accesstoken: this.userInfo.token
                })
            } catch (res) {
                this.$alert(res.body.error_msg)
                return
            }

            this.topic.replies.find((reply) => {
                if (reply.id === id) {
                    switch (res.body.action) {
                        case 'up':
                            reply.ups.push(this.userInfo.id)
                            break
                        case 'down':
                            reply.ups = reply.ups.filter(v => v !== this.userInfo.id)
                            break
                        default:
                            this.$alert('点赞出错')
                    }
                    return true
                } else {
                    return false
                }
            })
        },
        hasUped(ups = []) {
            return ups.find(v => v === this.userInfo.id)
        },
        addReply(replyId) {
            if (!this.userInfo.id) {
                this.$router.push({
                    name: 'login',
                    query: {
                        redirect: this.$route.fullPath
                    }
                })
            } else {
                this.currentReply = replyId
            }
        }
    },
    created() {
        this.topic.id = this.$route.params.id || ''

        this.getTopic()
    },
    components: {
        Reply
    }
}
</script>



<style lang="less" scoped>
@import '~@less/mixins.less';

.topic {
    padding: 0 @paddingSpace;

    .title {
        padding: 5px;
        margin: 15px 0;
        font-size: 1.1rem;
        color: #2c3e50;
        background-color: #f0f0f0;
        border-radius: 5px;
    }

    .info {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;

        .left {
            display: flex;
            align-items: center;

            .link {
                margin-right: 10px;
                font-size: 0;

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
            }
            .texts {
                display: flex;
                flex-direction: column;

                .name,
                .create-at {
                    padding: 5px 0;
                }
            }
        }
        .right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: right;
            .label {
                padding: 5px 6px;
                color: #fff;
                text-align: center;
                border-radius: 4px;

                .topic-label-color();
            }

            .visit-count {
                padding: 5px 0;
            }
        }
    }

    .content {
        margin-top: 30px;
    }
}

.section-reply {
    .title {
        padding: @paddingSpace;
        border-top: 1px solid @borderColor;

        .reply-count {
            color: @green;
        }
    }
    .reply-list {
        .reply {
            padding: 10px @paddingSpace;
            border-top: 1px solid @borderColor;

            .info {
                display: flex;
                justify-content: space-between;

                .left {
                    display: flex;
                    align-items: center;
                    max-width: 65%;

                    .avatar-link {
                        display: inline-block;
                        margin-right: 10px;
                        font-size: 0;

                        .avatar {
                            width: 45px;
                            height: 45px;
                            border-radius: 10px;
                        }
                    }
                    .text {
                        font-size: 0.9rem;
                    }
                }
                .right {
                    display: flex;
                    align-items: center;

                    .iconfont {
                        font-size: 1.5rem;

                        &.active {
                            color: @lightGreen;
                        }
                    }

                    .up-count {
                        margin: 0 10px 0 5px;
                    }
                }
            }

            .content {
                margin-top: 10px;
                font-size: 0.9rem;
                overflow-x: scroll;
            }
        }
    }
}
</style>

<style lang="less">
.section-reply {
    .reply-list {
        .reply {
            .content {
                img {
                    max-width: 100%;
                }
            }
        }
    }
}
</style>


