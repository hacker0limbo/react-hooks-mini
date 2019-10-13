# react-hooks-mini

原生 js 实现的简易 react-hooks, 仅适用于 node, 暂无和 dom 的集成. hooks 包括:
- `useState`
- `useEffect`
- `useRef`

示例代码查看 [example.js](/example.js)

## 使用方法

```javascript
// 引入 hooks, render 方法在每一次 state 改变之后手动调用
const { useState, useEffect, render } = require('./lib')

const MyApp = () => {
  // 自己设置一些 state 和 method, 可以参考 example.js 
}

// 初次 render MyApp
let App = render(MyApp)

App.method1()
// 手动重新 render
App = render(MyApp)

App.method2()
// 手动重新 render
App = render(MyApp)
```
