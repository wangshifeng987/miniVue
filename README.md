### 迷你版本Vue


<p align="center">
用来学习vue原理,如果有新的理解，我会及时更新的，并且期待大佬的批评指点。
</p>

---

### 使用

```sh
# 下载
npm install 

# 编译打包
npm run build

# 预览
npm run serve



---

**实现代码演示（未完）**

​```html
<script>
    new Vue({
        el: '#app',
        data () {
            return {
                msg: '<h1>测试</h1>',
                age: 99
            }
        },
        methods: {
            clickTest () {
                alert(`msg是：${this.$data.msg}`)
            }
        }
    })
</script>
```


### 实现列表

- [x] 模板解析（插值表达式 和 指令）
    - [x] 插值表达式解析（解析基础数据绑定）
    - [x] v-text
    - [x] v-html
    - [x] v-model
    - [x] v-on：
- [x] 发布订阅者模式
- [x] v-model 双向数据绑定
