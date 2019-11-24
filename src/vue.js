import {Observe} from './observe'
import {Compile} from './compile'
export class Vue {
    constructor (options={}){
       // 给Vue实例增加属性
       this.$el=options.el
       this.$data=options.data()
       this.$methods=options.methods

        //监听data中的数据
       new Observe(this.$data)
       
       //如果指定了 el 参数,我们就可以进行解析
       if(this.$el) {
           //解析模板内容,需要传递模板和整个vue实例
           new Compile(this.$el,this)
       }
   }

}