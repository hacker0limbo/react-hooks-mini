# react-hooks-mini

原生 js 实现的简易 react-hooks, 仅适用于 node, 暂无和 dom 的集成. hooks 包括:
- `useState`
- `useEffect`
- `useRef`

## 文件结构
```
src/
  index.js    ------ 源码
examples/
  index.js    ------ 示例 1
  Counter.js  ------ 示例 2
index.js/     ------ 入口文件
```

## 使用方法

更多用法参考 [examples目录](/examples/index.js)

### 基本使用

```
npm install react-hooks-mini
```

```javascript
const { useState, useEffect } = require('react-hooks-mini')

const MyApp = () => {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('foo')

  useEffect(() => {
    console.log('effect', count, text)
  }, [count, text])

  const click = () => {
    setCount(count+1)
  }

  const type = newText => {
    setText(newText)
  }

  const render = () => {
    console.log('render', { count, text })
  }

  return {
    click,
    type,
    render
  }
}

let App = render(MyApp)
App.click()
App = render(MyApp)

App.type('bar')
App = render(MyApp)
```