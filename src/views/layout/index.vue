<template>
    <div>
        <navigation :pageType="this.$route.query.tab||this.$route.name"></navigation>
        <router-view>
        </router-view>
    </div>
</template>

<script>
import Navigation from '@/components/navigation'

export default {
    components: {
        Navigation
    }
}
</script>

