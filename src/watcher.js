//Dep 管理所有订阅者 和通知这些订阅者
export class Dep{
    constructor(){
        this.subs=[]
    }

    //添加订阅者
    addSub(watcher){
        if (!watcher) return
        this.subs.push(watcher)
    }

    //通知订阅者
    notify(){
        this.subs.forEach(sub=>{
            console.log(sub)
           sub.update()})     
    }
}

//主要作用监听某个对象是否发生变化 发生变化就调用回调函数
export class watcher {
    //vm 当前实例 | data 数据名称 | callback 回调函数
   
    constructor(vm,expr,cb){
        this.vm=vm
        this.expr=expr
        this.cb=cb

        Dep.target=this    
        //需要把data旧值储存起来
        this.oldValue=this.vm.$data[expr]
        
        Dep.target = null
    }

    //对外暴露一个方法 用于更新页面
    update(){
        let oldValue = this.oldValue
        let newValue = this.vm.$data[this.expr]
        if (oldValue !== newValue) {
            this.cb(newValue, oldValue)
        }
    }
}