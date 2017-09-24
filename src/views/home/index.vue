<template>
    <div>
        <img class="startup-img" src="./img/startup.png">
    </div>
</template>
<script>
export default {
    mounted() {
        setTimeout(() => {
            this.$router.push({
                name: 'topicList'
            })
        }, 2000)
    }
}
</script>
<style lang="less" scoped>
.startup-img {
    width: 100%;
    margin-top: 40%;
    background-color: #fff;
}
</style>


