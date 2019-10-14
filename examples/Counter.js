const { useState, render } = require('../src')

const Counter = () => {
  const [count, setCount] = useState(0)

  const clickCallback = () => {
    // 传入的是一个回调函数, 在 render 前多次调用, 可以进行多次叠加 state 的设置
    // 每次拿到的都是上次 state 的值, 可以根据上次 state 的值进行 setStaet
    setCount(prevCount => prevCount+1)
  }

  const click = () => {
    // 传入的是一个常量, 如果在 render 前多次调用, 只会修改一次 state
    // 其余的 setCount() 均为覆盖
    setCount(count+1)
  }

  const log = () => {
    setCount(count+1)
    // 每次调用完成 log 之后, 都使用 render 重新渲染, 那么 MyApp() 会被重新调用
    // 每一次调用组件都形成一个新的环境, 每个环境里面的 state 都是不同的, 形成的也是不同的闭包
    // 因此 setTimeout 每次读取的也是不同的环境里的 count, 因此最后打印会依次打印出 1, 2, 3
    // 使用类组件就不同, 由于不存在闭包, 每次 render 之后 this.state 永远保持最新
    // 如果不 render 情况是完全不同的, 那么永远只会读取到第一次 useState 以后的值(即一开始的 initialValue)
    // 总结来说, 每次 render 就是保存了一次快照, 里面有自己的 state
    // https://zhuanlan.zhihu.com/p/67087685
    setTimeout(() => {
      console.log('App count with timeout', count)
    }, 3000)
  }

  const render = () => {
    console.log('App render', { count })
  }

  return {
    click,
    clickCallback,
    log,
    render,
  }
}

let App = render(Counter)
App.log()
App = render(Counter)

App.log()
App = render(Counter)

App.log()
App = render(Counter)

// 最后 3 秒后打印的结果为 0, 1, 2