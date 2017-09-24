<template>
    <div>
        <ul class="info-list">
            <li class="item">
                <h3 class="title">关于项目</h3>
                <p class="details">
                    该项目是fork了
                    <a class="link" href="https://github.com/shinygang/Vue-cnodejs">
                        Vue-cnodejs</a>
                    这个项目，在这个基础上重写的webapp。它基于CNode的API，使用了webpack, vue, vue-router, vuex等技术。<br><br> 相比原项目，本项目去掉了zepto, 在组件内直接利用ref操作DOM, 调整了目录结构，使代码更模块化。
                </p>
            </li>
            <li class="item">
                <h3 class="title">源码地址</h3>
                <p class="details">
                    <a class="link" href="https://github.com/wcxaa/Vue-cnodejs">
                        https://github.com/wcxaa/Vue-cnodejs</a>
                </p>
            </li>
            <li class="item">
                <h3 class="title">意见反馈</h3>
                <p class="details">
                    <a class="link" href="https://github.com/wcxaa/Vue-cnodejs/issues">
                        发表意见或者提需求</a>
                </p>
            </li>
            <li class="item">
                <h3 class="title">当前版本</h3>
                <p class="details">V2.0</p>
            </li>
        </ul>
    </div>
</template>

<style lang="less" scoped>
@import '~@less/variables.less';

.info-list {
    .item {
        padding: 5px @paddingSpace;
        border-bottom: 1px solid #d5dbdb;

        .title {
            padding: 15px 0;
        }

        .details {
            padding-bottom: 15px;
            font-size: 0.9rem;
        }

        .link {
            color: @green;
        }
    }
}
</style>

