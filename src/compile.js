import { watcher } from "./watcher";
export class Compile {
    /**
     * 
     * @param {*} el 传递的模板
     * @param {*} vm vue实例
     */
    constructor(el, vm) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el
        this.vm = vm

        //编译模板内容
        if (this.el) {
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
        let childNodes = el.childNodes //类数组
        this.toArray(childNodes).forEach(item => {
            fragment.appendChild(item)
        })
        return fragment
    }
    compile(fragment) {
        // 获取所有子节点
        let childNodes = fragment.childNodes
        this.toArray(childNodes).forEach(node => {
            //如果是文本节点,需要解析 插值表达式
            if (this.isTextNode(node)) {
                //解析文本节点
                this.compileText(node)
            }
            // 如果是元素(标签),需要解析指令
            if (this.isElementNode(node)) {
                this.compileElement(node)
            }
            //如果当前节点还有子节点,递归判断
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }
    //类数组转数组
    toArray(likeArray) {
        return [].slice.call(likeArray)
    }

    //判断元素节点 | 1:元素节点 | 3:文本节点
    //判断是不是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }
    //判断是不是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
    //判断是不是指令
    isDirective(attrName) {
        return attrName.startsWith('v-') //判断是不是v-开头
    }
    //判断是不是事件指令 v-on
    isEventDirective(type) {
        return type.split(':')[0] === 'on'
    }
    //解析文本节点
    compileText(node) {
        let txt = node.textContent
        let reg = /\{\{(.+)\}\}/
        if (reg.test(txt)) {
            //获取第一个匹配项
            let expr = RegExp.$1
            //替换
            node.textContent = txt.replace(reg, this.vm.$data[expr])
            //
            new watcher(this.vm, expr, (newValue, oldValue) => {
                node.textContent = txt.replace(reg, newValue)
            })
        }
    }
    //解析元素(标签)节点
    compileElement(node) {
        //指令:html一个以v开头的属性
        //获取当前节点下得到所有属性
        let attributes = node.attributes //类数组
        this.toArray(attributes).forEach(attr => {
            let attrName = attr.name
            //解析vue指令(v-开头)
            if (this.isDirective(attr.nodeName)) {
                //从索引2处开始截取字符串   
                let type = attrName.slice(2)
                //获取属性的值
                let attrValue = attr.value
                //判断是不是v-on
                if (this.isEventDirective(type)) {
                    //事件类型                 
                    let eventType = type.split(':')[1]
                    //给节点添加事件
                    node.addEventListener(eventType, this.vm.$methods[attrValue].bind(this.vm))
                } else {
                    //其他指令
                    ComileUtil[type](node, this.vm, attrValue)
                }
            }
        })
    }

}
//解析其他 指令
let ComileUtil = {

    //处理text指令
    text(node, vm, attrValue) {
        node.textContent = vm.$data[attrValue]
        new watcher(vm, attrValue, (newValue, oldValue) => {
            node.textContent = newValue
        })
    },
    // 解析 v-html 指令
    html(node, vm, attrValue) {
        node.innerHTML = vm.$data[attrValue]
        new watcher(vm, attrValue, (newValue, oldValue) => {
            node.innerHTML = newValue
        })
    },
    // 解析 v-model 指令
    model (node, vm, attrValue) {
        node.value = vm.$data[attrValue]

        // 注册事件
        node.addEventListener('input', e => vm.$data[attrValue] = event.target.value)
        
        new watcher(vm, attrValue, (newValue, oldValue) => {
            node.value = newValue
        })
    }
}