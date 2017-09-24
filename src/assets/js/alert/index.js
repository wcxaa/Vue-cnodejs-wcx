import Alert from './alert'

function install(Vue) {
    let AlertConstructor = Vue.extend(Alert)
    let alertInstance = null

    Object.defineProperty(Vue.prototype, '$alert', {
        get: () => {
            return (message) => {
                if (alertInstance) {
                    alertInstance.$el.remove()
                    alertInstance = null
                }

                alertInstance = new AlertConstructor({
                    propsData: {
                        message: message
                    }
                }).$mount()
                document.body.appendChild(alertInstance.$el)

            }
        }
    })
}

if (window.Vue) {
    Vue.use(install)
}

export default install