<template>
    <transition name="alert">
        <div class="alert" v-if="show" ref="alert">
            {{ message }}
        </div>
    </transition>
</template>


<script>
export default {
    props: {
        message: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            show: false,
            timer: null
        }
    },
    mounted() {
        this.show = true
        this.timer = setTimeout(() => {
            this.show = false
        }, 2000)
    },
    beforeDestroy() {
        clearTimeout(this.timer)
    }
}
</script>

<style lang="less" scoped>
.alert {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 9px 20px;
    color: #fff;
    text-align: center;
    background-color: rgba(75, 75, 75, 0.85);
    z-index: 9;
}

.alert-enter-active,
.alert-leave-active {
    transition: transform 0.4s;
}

.alert-enter,
.alert-leave-to {
    transform: translateY(-100%);
}
</style>
