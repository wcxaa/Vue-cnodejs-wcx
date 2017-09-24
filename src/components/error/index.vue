<template>
    <div class="error">
        出错了,err:<br>{{ err.bodyText||err.body }}
    </div>
</template>

<script>
export default {
    props: {
        err: Object
    }
}
</script>

<style lang="less" scoped>
.error {
    padding-top: 40px;
    text-align: center;
}
</style>

