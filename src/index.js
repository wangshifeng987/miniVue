import {Vue} from './vue'
let vm = new Vue({
    el: '#app',
    data () {
        return {
            msg: '<h1>测试</h1>',
            age: 99
        }
    },
    methods: {
        clickTest () {
            this.$data.age += 1
        }
    }
})