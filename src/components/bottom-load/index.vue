<template>
    <div class="wrapper" ref="wrapper">
        <loading-span v-if="!noMore"></loading-span>
        <span v-if="noMore">
            没有更多了
        </span>
    </div>
</template>



<script>
// import TWEEN from '@tweenjs/tween.js'
import { throttle } from '@js/utils'
import LoadingSpan from '@/components/loading-span'

export default {
    props: {
        // error: Object,
        noMore: {
            type: Boolean,
            required: true
        }

    },
    data() {
        return {
            scrollHandler: null
        }
    },
    methods: {
        scroll() {
            let wrapper = this.$refs.wrapper
            let parent = wrapper.offsetParent
            let valid = wrapper.offsetTop + wrapper.offsetHeight <= parent.scrollTop + parent.clientHeight

            if (valid) {
                this.$emit('load')
                // console.log('emit')
            }
        },
        addScroll() {
            document.addEventListener('scroll', this.scrollHandler = throttle(this.scroll, 150, 300), true)
        },
        removeScroll() {
            document.removeEventListener('scroll', this.scrollHandler, true)
        }

    },
    mounted() {
        this.addScroll()
    },
    beforeDestroy() {
        this.removeScroll()
    },
    watch: {
        // error(to) {
        //     if (to) {
        //         console.log('load error')
        //         let wrapper = this.$refs.wrapper
        //         let parent = wrapper.offsetParent
        //         let scrollTo = wrapper.offsetTop - parent.clientHeight

        //         let animate = (time) => {
        //             requestAnimationFrame(animate);
        //             TWEEN.update(time);
        //         }

        //         let tween = new TWEEN.Tween({
        //             y: parent.scrollTop
        //         })
        //             .to({
        //                 y: scrollTo
        //             }, 300)
        //             .onUpdate((object) => {
        //                 parent.scrollTop = object.y
        //             })

        //         let touchstartHandler = () => {
        //             tween.stop()
        //         }
        //         tween
        //             .onStart(() => {
        //                 this.removeScroll()
        //                 document.addEventListener('touchstart', touchstartHandler, {
        //                     once: true
        //                 }, true)
        //             })
        //             .onUpdate((object) => {
        //                 parent.scrollTop = object.y
        //             })
        //             .onComplete(() => {
        //                 document.removeEventListener('touchstart', touchstartHandler, true)
        //             })
        //             .start()

        //         animate()
        //     }
        // },
        noMore(to) {
            if (to) {
                this.removeScroll()
            }
        }
    },
    components: {
        LoadingSpan
    }
}
</script>



<style lang="less" scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
}
</style>
 