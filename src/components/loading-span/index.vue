<template>
    <span class="loading">
        <span class="iconfont icon-loading"></span>
        加载中
        <span class="dot">...</span>
    </span>
</template>


<style lang="less" scoped>
@keyframes rotate {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dot {
    33% {
        transform: translateY(-2em);
    }
    66% {
        transform: translateY(-1em);
    }
}

.loading {
    position: relative;
    padding-left: 23px;
    color: #666;

    .icon-loading {
        display: block;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -10px;
        height: 20px;
        line-height: 20px;
        font-size: 1.2em;
        animation: rotate 1.2s linear infinite;
    }

    .dot {
        display: inline-block;
        height: 1em;
        line-height: 1;
        text-align: left;
        vertical-align: -.25em;
        overflow: hidden;

        &::before {
            display: block;
            content: '...\A..\A.';
            white-space: pre-wrap;
            animation: dot 3s infinite step-start both;
        }
    }
}
</style>
