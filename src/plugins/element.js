import {
    Button,
    Popover,
} from 'element-ui'
const element = {
    install: function(Vue) {
        Vue.use(Button)
        Vue.use(Popover)
    }
}

export default element