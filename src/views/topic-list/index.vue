<template>
    <div>
        <loading v-if="loading"></loading>
        <error v-if="error" :err="error"></error>
        <section v-if="!loading&&!error">
            <ul class="topicList" ref="topicList">
                <li v-for="topic in topicList" :key="topic.id">
                    <router-link class="topic" :to="{name:'topic',params:{id:topic.id}}">
                        <h3 class="title">
                            <span class="label" :class="[{top:topic.top},{good:topic.good},topic.tab]">{{getTopicLabel(topic.top,topic.good,topic.tab)}}</span>
                            <span class="text">{{topic.title}}</span>
                        </h3>
                        <div class="content">
                            <div class="left">
                                <img class="avatar" :src="topic.author.avatar_url">
                                <span class="texts">
                                    <span class="name">{{topic.author.loginname}}</span>
                                    <time class="create-at">{{topic.create_at | getTimeago}}</time>
                                </span>
                            </div>
                            <div class="right">
                                <span class="status">
                                    <b class="reply-count">{{topic.reply_count}}</b> / {{topic.visit_count}}
                                </span>
                                <time class="last-replay-at">{{topic.last_reply_at | getTimeago}}</time>
                            </div>
                        </div>
                    </router-link>
                </li>
                <li>
                    <bottom-load :no-more="noMore" @load="getNextPageTopicList"></bottom-load>
                </li>
            </ul>
        </section>
    </div>
</template>



<script>
import { getTopicLabel, throttle } from '@js/utils'
import BottomLoad from '@/components/bottom-load'

export default {
    data() {
        return {
            loading: false,
            error: null,
            fetchData: {
                loading: false,
                error: null
            },

            topicList: [],
            searchKey: {
                page: 0,
                tab: 'all',
                limit: 20,
                mdrender: true
            },
            noMore: false
        }
    },
    methods: {
        /*
         *  获取一页的topicList
         *  @params {{Object}} searchKey default: this.searchKey [获取数据时的参数]
         *  @return {{Object}}                                   [data: topicList, error: 错误] 
         */
        async getTopicList(searchKey = this.searchKey) {
            // console.log('getTopicList: start')
            if (this.fetchData.loading) {
                return [[], new Error('loading')]
            }
            // console.log('getTopicList: actually run')
            this.fetchData.loading = true
            this.fetchData.error = null

            searchKey = Object.assign({}, this.searchKey, searchKey)
            let res = null
            let data = []

            try {
                res = await this.$http.get('topics', {
                    params: searchKey
                })
            } catch (err) {
                this.fetchData.error = err
            }

            data = res.body.data

            this.fetchData.loading = false
            // console.log('getTopicList: end')
            return [data, this.fetchData.error]
        },
        async getNextPageTopicList() {
            this.searchKey.page++
            let [data, error] = await this.getTopicList()
            if (!error) {
                if (!data.length) {
                    this.noMore = true
                } else {
                    this.topicList = [...this.topicList, ...data]
                }
            }

            return error
        },
        async initGetTopicList() {
            this.loading = true
            this.error = await this.getNextPageTopicList()
            this.loading = false
        },
        getTopicLabel(top, good, tab) {
            return getTopicLabel(top, good, tab)
        },
        throttle
    },
    watch: {
        '$route'(to, from) {
            if (to.query && to.query.tab) {
                this.searchKey.tab = to.query.tab
                this.searchKey.page = 0
                this.topicList = []
            }

            this.initGetTopicList();
        }
    },
    created() {
        this.searchKey.tab = this.$route.query.tab || this.searchKey.tab

        let data = JSON.parse(window.sessionStorage.getItem('data'))
        if (data && data.searchKey.tab === this.searchKey.tab) {
            Object.keys(this.$data).forEach((k) => {
                this[k] = data[k]
            })
            this.$nextTick(() => {
                this.$refs.topicList.scrollTop = JSON.parse(window.sessionStorage.getItem('scrollTop'))
            })
        } else {
            this.initGetTopicList()
        }

    },
    beforeRouteEnter(to, from, next) {
        if (from.name !== 'topic') {
            window.sessionStorage.removeItem('data')
            window.sessionStorage.removeItem('scrollTop')
        }

        next()
    },
    beforeRouteLeave(to, from, next) {
        if (to.name === 'topic') {
            window.sessionStorage.setItem('data', JSON.stringify(this.$data))
            window.sessionStorage.setItem('scrollTop', JSON.stringify(this.$refs.topicList.scrollTop))
        }

        next()
    },
    components: {
        BottomLoad
    }
}
</script>



<style lang="less" scoped>
@import '~@less/mixins.less';

.topicList {
    .topic {
        display: block;
        padding: 10px @paddingSpace;
        color: @textBaseColor;
        border-bottom: 1px solid @borderColor;

        .title {
            display: flex;
            align-items: center;
            color: @topicTitleColor;
            white-space: nowrap;

            .label {
                padding: 5px 6px;
                margin-right: 10px;
                font-size: 0.6rem;
                color: #fff;
                border-radius: 4px;
                .topic-label-color();
            }

            .text {
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .content {
            display: flex;
            justify-content: space-between;
            padding-top: 10px;
            font-size: 0.9rem;

            .left {
                display: flex;
                align-items: center;

                .avatar {
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                    border-radius: 50%;
                }
                .texts {
                    display: flex;
                    flex-direction: column;
                }
            }
            .right {
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: right;
                .status {
                    .reply-count {
                        color: @green;
                    }
                }
            }
        }
    }
}
</style>
