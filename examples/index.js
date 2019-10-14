const { useState, useEffect, render } = require('../src')

// 自定义 hooks
// 该 hooks 接受初始 state 为一个 url 字符串, 返回的 state 为一个数组, 带有解析的 url 元素
const useSplitURL = urlStr => {
  const [url, setUrl] = useState(urlStr)
  return [url.split('.'), setUrl]
}

const MyApp = () => {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('foo')
  const [splitedUrl, setSplitedUrl] = useSplitURL('www.reactjs.org')

  useEffect(() => {
    console.log('effect', count, text, splitedUrl)
  }, [count, text, splitedUrl])

  const clickCallback = () => {
    setCount(prevCount => prevCount+1)
  }

  const click = () => {
    setCount(count+1)
  }

  const type = newText => {
    setText(newText)
  }

  const keep = () => {
    setText(text)
    setCount(count)
  }

  const locate = newUrl => {
    setSplitedUrl(newUrl)
  }

  const render = () => {
    console.log('render', { count, text, splitedUrl })
  }

  return {
    click,
    clickCallback,
    type,
    keep,
    locate,
    render
  }
}

let App = render(MyApp)
// click() 由于设置的是常量, 重复设置了两次, 相当于只设置了一次
// clickCallback() 接受的是 callback, 可以正确拿到上次的 state, 再上次基础上计算
// 最后 count 的值为 3
App.click()
App.click()
App.clickCallback()
App.clickCallback()
App = render(MyApp)

App.type('bar')
App = render(MyApp)

// // 这里不会 run effect, 由于 dep array 没有任何变化
App.keep()
App = render(MyApp)

App.locate('www.redux.js.org')
App = render(MyApp)

