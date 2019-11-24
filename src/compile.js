import { watcher } from "./watcher";
export class Compile {
    /**
     * 
     * @param {*} el 传递的模板
     * @param {*} vm vue实例
     */
    constructor(el,vm){
        this.el= typeof el ==='string' ? document.querySelector(el) : el
        this.vm = vm

        //编译模板内容
        if(this.el){
            //把el中所有节点放到fragment中(文档碎片)
            let fragment = this.node2fragment(this.el)
            //编译 fragment
            this.compile(fragment)
            //把 fragment 的内容一次放到 DOM中
            this.el.appendChild(fragment)
        }
    }

    /** 核心方法 */

    //把节点转换为文档碎片
    node2fragment(el) { 
        let fragment = document.createDocumentFragment()
        //把el中所有的子节点 挨个添加到文档碎片
        let childNodes = el.childNodes  //类数组
        this.toArray(childNodes).forEach(item =>{
            fragment.appendChild(item)
        })
        return fragment
    }
    compile(fragment) {
        // 获取所有子节点
        let childNodes=fragment.childNodes  
        this.toArray(childNodes).forEach(node =>{
            //如果是文本节点,需要解析 插值表达式
            if(this.isTextNode(node)){
                //解析文本节点
                this.compileText(node)
            }
            //如果当前节点还有子节点,递归判断
            if(node.childNodes && node.childNodes.length > 0){
                this.compile(node)
            }
        })
    }
    //类数组转数组
    toArray(likeArray){
        return [].slice.call(likeArray)
    }

    //判断元素节点 | 1:元素节点 | 3:文本节点
    //判断是不是文本节点
    isTextNode(node){
        return node.nodeType === 3
    }
    //解析文本节点
    compileText(node){
        let txt = node.textContent
        let reg = /\{\{(.+)\}\}/
        if(reg.test(txt)){
             //获取第一个匹配项
            let expr = RegExp.$1 
            //替换
            node.textContent=txt.replace(reg,this.vm.$data[expr]) 
            //
            new watcher(this.vm,expr,(newValue,oldValue)=>{
                node.textContent = txt.replace(reg,newValue)
            })
        }
    }
   
    
}