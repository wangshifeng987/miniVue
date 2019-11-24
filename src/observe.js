import {Dep} from './watcher'
export class Observe{
    constructor(data){
        this.data=data
        this.walk(data)
    }

    //核心遍历
    //遍历 data 数据中的所有数据,都添加上 getter 和 setter 方法
    walk (data) {
        //判断是不是对象
        if(typeof data !== 'object') return data

        Object.keys(data).forEach(key => {
            this.defineReactive(data,key,data[key])
        })
    }
    //数据劫持
    defineReactive(obj,key,value){
        //递归,多层遍历
        this.walk(value)
        //Dep管理依赖
        let dep = new Dep()
        //添加set,get方法
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,      
            get(){
                dep.addSub(Dep.target)    
                return value
            },
            set(newValue){
                if(value===newValue) return;
                if(typeof newValue === 'object') this.walk(newValue)             
                value=newValue
                dep.notify()
            }
        })
    }
}