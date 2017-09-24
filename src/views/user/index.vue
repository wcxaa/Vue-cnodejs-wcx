<template>
    <div>
        <loading v-if="loading"></loading>
        <error v-if="error" :err="error"></error>
        <div v-if="!loading&&!error">
            <section class="user-info">
                <img class="avatar" :src="user.avatar_url" alt="avatar">
                <p class="loginname">{{user.loginname}}</p>
                <div class="bottom">
                    <span>{{user.create_at | getFmtDate}}</span>
                    <span class="score">积分：{{user.score}}</span>
                </div>
            </section>
            <section class="topic-part">
                <div class="topic-nav">
                    <span class="item" :class="{active: activeTopicNav===RECENT_REPLY}" @click="setTopicNav(RECENT_REPLY)">最近回复</span>
                    <span class="item" :class="{active: activeTopicNav===RECENT_PUBLISH}" @click="setTopicNav(RECENT_PUBLISH)">最近发布</span>
                </div>
                <ul class="topic-list">
                    <li class="topic" v-for="topic in topicList" :key="topic.id">
                        <router-link class="link" :to="{name:'topic', params:{id: topic.id}}">
                            <img class="avatar" :src="topic.author.avatar_url" alt="avatar">
                            <div class="right">
                                <h4 class="title">{{topic.title}}</h4>
                                <div class="bottom">
                                    <span>{{topic.author.loginname}}</span>
                                    <span class="last-reply-at">{{topic.last_reply_at | getTimeago}}</span>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
                <div class="no-data" v-if="!topicList.length">
                    暂无数据
                </div>
            </section>
        </div>
    </div>
</template>



<script>
const RECENT_REPLY = Symbol('recent_reply')
const RECENT_PUBLISH = Symbol('recent_publish')

export default {
    data() {
        return {
            loading: false,
            error: null,
            user: {},
            activeTopicNav: undefined,
            topicList: [],

            RECENT_REPLY,
            RECENT_PUBLISH,
        }
    },
    methods: {
        async getUser() {
            this.loading = true
            this.error = null
            let loginname = this.$route.params.loginname

            let res;
            try {
                res = await this.$http.get('user/' + loginname)
                this.user = res.body.data
            } catch (res) {
                this.error = res
            }

            this.loading = false
        },
        setTopicNav(tab) {
            this.activeTopicNav = tab

            let listName = ''
            switch (tab) {
                case RECENT_REPLY:
                    listName = 'recent_replies'
                    break;
                case RECENT_PUBLISH:
                    listName = 'recent_topics'
                    break;
            }

            this.topicList = this.user[listName]
        },
        async init() {
            await this.getUser()
            this.setTopicNav(RECENT_REPLY)
        }
    },
    watch: {
        '$route'(to, from) {
            this.init()
        }
    },
    created() {
        this.init()
    }
}
</script>


<style lang="less" scoped>
@import '~@less/variables.less';

.user-info {
    padding: 15px @paddingSpace;
    background-color: #e7e7e7;
    text-align: center;

    .avatar {
        width: 100px;
        border-radius: 50%;
    }
    .bottom {
        margin-top: 15px;

        .score {
            margin-left: 40px;
            color: @lightGreen;
        }
    }
}

.topic-part {
    .topic-nav {
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
        }
    }

    .topic-list {
        .topic {
            .link {
                display: block;
                position: relative;
                padding: 15px @paddingSpace;
                white-space: nowrap;
                border-bottom: 1px solid @borderColor;

                .avatar {
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    left: @paddingSpace;
                    top: 50%;
                    margin-top: -25px;
                    border-radius: 50%;
                }
                .right {
                    padding-left: 50px + 10px;

                    .title {
                        font-size: 1.2rem;
                        color: #333;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .bottom {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 10px;
                        color: @textBaseColorLighter;

                        .last-reply-at {
                            color: @lightGreen;
                        }
                    }
                }
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
