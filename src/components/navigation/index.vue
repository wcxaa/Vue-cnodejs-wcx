<template>
    <div class="layout" :class="{'show-menu': showMenu}">
        <header>
            <span class="iconfont icon-menu-hamburger" @click="toggleMenu"></span>
            <span class="page-title">{{ pageTitle }}</span>
            <router-link :to="{name:'addTopic'}" class="send-wrapper">
                <i class="iconfont icon-send"></i>
            </router-link>
        </header>
        <div class="divider"></div>
        <section class="sidebar">
            <div class="user-info">
                <div v-if="!userInfo.loginname">
                    <router-link class="link" :to="{name:'login', query:{redirect: encodeURIComponent(this.$route.path)}}">
                        <span class="iconfont icon-login"></span> 登录
                    </router-link>
                </div>
                <div v-if="userInfo.loginname">
                    <router-link class="link" :to="{name: 'user',params:{loginname: userInfo.loginname}}">
                        <span class="avatar-wrapper iconfont icon-account">
                            <img class="avatar" :src="userInfo.avatar_url" alt="avater" v-if="userInfo.avatar_url">
                        </span> {{userInfo.loginname}}
                    </router-link>
                </div>
            </div>
            <div class="links">
                <router-link class="link" :to="{name:'topicList',query:{tab:'all'}}">
                    <span class="iconfont icon-all"></span>
                    {{getPageTitle('all')}}
                </router-link>
                <router-link class="link" :to="{name:'topicList',query:{tab:'good'}}">
                    <span class="iconfont icon-good"></span>
                    {{getPageTitle('good')}}
                </router-link>
                <router-link class="link" :to="{name:'topicList',query:{tab:'share'}}">
                    <span class="iconfont icon-share"></span>
                    {{getPageTitle('share')}}
                </router-link>
                <router-link class="link" :to="{name:'topicList',query:{tab:'ask'}}">
                    <span class="iconfont icon-ask"></span>
                    {{getPageTitle('ask')}}
                </router-link>
                <router-link class="link" :to="{name:'topicList',query:{tab:'job'}}">
                    <span class="iconfont icon-job"></span>
                    {{getPageTitle('job')}}
                </router-link>
                <router-link class="link" :to="{name:'topicList',query:{tab:'dev'}}">
                    <span class="iconfont icon-test"></span>
                    {{getPageTitle('dev')}}
                </router-link>
                <router-link class="link divide" :to="{name:'message'}">
                    <span class="iconfont icon-message"></span>
                    {{getPageTitle('message')}}
                    <span class="messageNotReadCount" v-if="messageNotReadCount>0">{{messageNotReadCount}}</span>
                </router-link>
                <router-link class="link" :to="{name:'about'}">
                    <span class="iconfont icon-about"></span>
                    {{getPageTitle('about')}}
                </router-link>
            </div>
        </section>
        <div class="page-cover" @click="toggleMenu"></div>
    </div>
</template>



<script>
import { PageType2Title } from '@js/utils'

export default {
    props: {
        pageType: String,
    },
    data() {
        return {
            showMenu: false
        }
    },
    methods: {
        getPageTitle(pageType) {
            return PageType2Title[pageType] || PageType2Title['all']
        },
        toggleMenu() {
            this.showMenu = !this.showMenu
        },
        resetMenu() {
            this.showMenu = false
        },
        async getMessageNotReadCount() {
            if (!this.userInfo.token) {
                return
            }
            try {
                let res = await this.$http.get('message/count', {
                    params: {
                        accesstoken: this.userInfo.token
                    }
                })

                if (res.body.data) {
                    this.$store.commit('message/setMessageNotReadCount', parseInt(res.body.data))
                }
            } catch (err) {
                console.log('get messageNotReadCount error:', err)
            }
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo
        },
        pageTitle() {
            return this.getPageTitle(this.pageType)
        },
        messageNotReadCount() {
            return this.$store.state.message.messageNotReadCount
        }
    },
    mounted() {
        this.getMessageNotReadCount()
    },
    watch: {
        '$route'(to, from) {
            this.resetMenu()
            this.getMessageNotReadCount()
        }
    }
}
</script>



<style lang="less" scoped>
@import '~@less/variables.less';

@headerHeight: 44px;
@sidebarWidth: 200px;

.layout {
    position: relative;

    header {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: @headerHeight;
        padding: 0 @paddingSpace;
        background-color: rgba(255, 255, 255, 0.95);
        box-shadow: 0 0 4px rgba(0, 0, 0, .25);

        .icon-menu-hamburger,
        .page-title,
        .send-wrapper {
            display: flex;
            align-items: center;
        }

        .icon-menu-hamburger {
            font-size: 1.5rem;
            color: #888;
        }

        .page-title {
            font-size: 1.1rem;
        }

        .send-wrapper {
            .icon-send {
                font-size: 1.25rem;
                color: @green;
            }
        }
    }

    .divider {
        height: @headerHeight;
    }

    .sidebar {
        @paddingSpace: 24px;

        position: fixed;
        top: 0;
        left: -@sidebarWidth;
        width: @sidebarWidth;
        height: 100vh;
        background-color: #fff;
        z-index: 3;

        .link {
            color: @textBaseColor;
        }

        .user-info {
            padding: @paddingSpace;
            .link {
                display: flex;
                align-items: center;

                .icon-login {
                    margin-right: 8px;
                    font-size: 1.8rem;
                    color: #ff5a5f;
                }

                .avatar-wrapper {
                    display: inline-block;
                    position: relative;
                    margin-right: 8px;

                    &:before {
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        font-size: 38px;
                        z-index: -1;
                    }

                    .avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                    }
                }
            }
        }

        .links {
            padding: @paddingSpace 0;
            margin: 0 @paddingSpace;
            border-top: @borderColor solid 1px;

            .link {
                display: block;
                padding: 10px 0;
                font-size: 0.9rem;
                font-weight: 700;
                text-indent: 1px;

                .iconfont {
                    margin-right: 30px;
                }

                .messageNotReadCount {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    margin-left: 25px;
                    color: #fff;
                    background-color: @lightGreen;
                    text-align: center;
                    border-radius: 50%;
                }

                &.divide {
                    border-top: @borderColor solid 1px;
                }
            }
        }
    }

    header,
    .sidebar {
        transition: transform .3s ease;
    }

    .page-cover {
        display: none;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, .4);
        z-index: 2;
    }

    &.show-menu {
        header,
        .sidebar {
            transform: translateX(@sidebarWidth);
        }
        .page-cover {
            display: block;
        }
    }
}
</style>



