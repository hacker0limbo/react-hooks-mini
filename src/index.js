const assert = require('assert')

const React = (() => {
  // hooks 里面保存了 useState, useEffect 里面的状态以及依赖数组
  // 例如可能为 [count, [count, otherstates]] 
  const hooks = []
  // 当前 hooks, 用于定位到 state 或者 useEffect 里的 dependency array
  // 每次 render 之后都会被清零
  let currentHookIndex = 0

  const useState = initialValue => {
    // 由于 render 会多次调用, 当第一次初始化 App 的时候, 这时候 hooks 里还没有任何数据
    // 所以 state 使用的是 initialValue, 作为最初的 stae
    // 后面进行了计算以后, hooks 里面存了对应的数据了, 是所有 hooks 里面的数据
    const state = hooks[currentHookIndex] || initialValue
    // 增加一个临时变量, 为 setState 闭包做准备, 使其可以正确读取到对应的 currentHookIndex
    // 否则由于每次 render 以后, currentHookIndex 被清零, setState 永远只能修改第一个 state
    // 具体的实现原因是, 由于 useState 实际只会调用一次, 每次调用玩以后, _currentHookIndex 就记住了当前的 hooks 的索引
    // 以后使用 对应的 setState 时候, 由于 setState 也是一个闭包, _currentHookIndex 就能记住这个 setState 需要去设置的哪个 state
    // 所以这里的 _currentHookIndex 作用很简单, 在 currentHookIndex 被销毁后仍然可以记住 currentHookIndex
    const _currentHookIndex = currentHookIndex
    const setState = newState => {
      // newState 可以是一个函数, 也可以是一个常量
      if (typeof(newState) === 'function') {
        // 在 newState 是一个回调函数的情况下, 需要根据上次的 state 进行计算
        if (hooks[_currentHookIndex]) {
          hooks[_currentHookIndex] = newState(hooks[_currentHookIndex])
        } else {
          // 初始时 initialValue 是 undefined, 因此使用 initialValue
          hooks[_currentHookIndex] = newState(initialValue)
        }
      } else {
        // 如果 newState 是一个常量, 直接设置值
        hooks[_currentHookIndex] = newState
      }
    }
    // useState hook 调用完毕, hook 索引 +1, 前往下一个 hook
    currentHookIndex++
    return [state, setState]
  }

  const useEffect = (callback, depArray) => {
    // useEffect 在 depArray 里面的任一一个元素发生改变之后调用 callback
    // 注意和 render 的区别, 即使有时候 render 了, 但是 depArray 里面元素并没有发生变化
    // 那么也不会调用 callback
    const hasNoDeps = !depArray
    const oldDeps = hooks[currentHookIndex]
    let hasChangedDeps = true
    if (oldDeps) {
      // 使用 node 的 deepEqual 或者 _.equals 来深度比较 dependency array 是否发生了变化
      try {
        // 无错误被捕获, 说明无改变
        assert.deepEqual(oldDeps, depArray)
        hasChangedDeps = false
      } catch (error) {
        // 发生错误被捕获, 说明 depArray 改变了
        hasChangedDeps = true
      }
      // hasChangedDeps = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]))
    }
    
    if (hasNoDeps || hasChangedDeps) {
      // 如果 dependency array 里面有任意一项发生了变化, 或者根本没有指定 dependency array
      // 那么调用这个 callback
      // 注意这里与 render 的区别, 可能 render 还是 render 了, 但是由于 dep array 没变, 
      // 这里的 callback 还是不会被调用
      callback()
      hooks[currentHookIndex] = depArray
    }
    // hook 加一保证正确前往下一个 hook
    currentHookIndex++
  }

  const useRef = initialValue => {
    // 也是返回一个 state
    return useState({
      current: initialValue
    })[0]
  }

  const render = Component => {
    const c = Component()
    c.render()
    // react 的思想是, 每次有 state 或者 props 改变的时候, 重新 render
    // 复位, 为下一次 render 做准备
    currentHookIndex = 0
    return c
  }

  return { 
    useState, 
    useEffect, 
    useRef,
    render 
  }
})()

module.exports = React