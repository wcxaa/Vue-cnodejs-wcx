<template>
    <div>
        <div class="tab-wrapper">
            <span class="text">选择分类：</span>
            <select v-model="topic.tab" class="tab">
                <option value="share">{{getPageTitle('share')}}</option>
                <option value="ask">{{getPageTitle('ask')}}</option>
                <option value="job">{{getPageTitle('job')}}</option>
                <option value="dev">{{getPageTitle('dev')}}</option>
            </select>
            <button class="btn" @click="addTopic">发布</button>
        </div>
        <div class="title-wrapper">
            <input class="title" v-model="topic.title" type="text" placeholder="标题，字数5字以上">
        </div>
        <div class="content-wrapper">
            <textarea class="content" v-model="topic.content" rows="30" placeholder="回复支持Markdown语法，请注意标记代码"></textarea>
        </div>
    </div>
</template>

<script>
import { PageType2Title } from '@js/utils'

export default {
    data() {
        return {
            topic: {
                accesstoken: '',
                title: '',
                tab: 'share',
                content: ''
            }
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo
        }
    },
    methods: {
        getPageTitle(pageType) {
            return PageType2Title[pageType]
        },
        async addTopic() {
            if (this.topic.title.length < 5) {
                this.$alert('标题，字数5字以上')
                return false
            }

            if (!this.topic.content) {
                this.$alert('请输入主题内容')
                return false
            }

            this.topic.accesstoken = this.userInfo.token

            try {
                await this.$http.post('topics', this.topic)
            } catch (res) {
                console.log(res)
                this.$alert('新建主题失败，请稍后再试')
                return false
            }

            this.$router.push({
                name: 'topicList'
            })
        }
    }
}
</script>


<style lang="less" scoped>
@import '~@less/variables.less';

.tab-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px @paddingSpace;

    .text {
        margin-right: 10px;
        font-size: 0.9rem;
    }
    .tab {
        flex-grow: 1;
        padding: 5px;
    }
    .btn {
        margin-left: 10%;
        padding: 5px 15px;
        color: #fff;
        background-color: #80bd01;
        border: none;
        border-radius: 5px;
    }
}

.title-wrapper {
    padding: 10px @paddingSpace;
    border-top: 1px solid @borderColor;
    border-bottom: 1px solid @borderColor;

    .title {
        font-size: 1rem;
        border: none;
    }
}

.content-wrapper {
    padding: 15px @paddingSpace;

    .content {
        padding: 5px;
        width: 100%;
        border: 1px solid @borderColor;
    }
}
</style>

