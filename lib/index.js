const assert = require('assert')

const React = (() => {
  // hooks 里面保存了 useState, useEffect 里面的状态以及依赖数组
  // 例如可能为 [count, [count]] 
  const hooks = []
  // 当前 hooks, 用于定位到 state 或者 useEffect 里的 dependency array
  // 每次 render 之后都会被清零
  let currentHookIndex = 0

  const useState = initialValue => {
    const state = hooks[currentHookIndex] || initialValue
    // 增加一个临时变量, 为 setState 闭包做准备, 使其可以正确读取到对应的 currentHookIndex
    // 否则由于每次 render 以后, currentHookIndex 被清零, setState 永远只能修改第一个 state
    // 具体的实现原因是, 由于 useState 实际只会调用一次, 每次调用玩以后, _currentHookIndex 就记住了当前的 hooks 的索引
    // 以后使用 对应的 setState 时候, 由于 setState 也是一个闭包, _currentHookIndex 就能记住这个 setState 需要去设置的哪个 state
    const _currentHookIndex = currentHookIndex
    const setState = newState => {
      // newState 可以是一个函数, 也可以是一个常量
      if (typeof(newState) === 'function') {
        if (hooks[_currentHookIndex]) {
          hooks[_currentHookIndex] = newState(hooks[_currentHookIndex])
        } else {
          // 初始时 initialValue 是 undefined, 因此使用 initialValue
          hooks[_currentHookIndex] = newState(initialValue)
        }
      } else {
        hooks[_currentHookIndex] = newState
      }
    }
    // useState hook 调用完毕, hook 索引 +1, 前往下一个 hook
    currentHookIndex++
    return [state, setState]
  }

  const useEffect = (callback, depArray) => {
    const hasNoDeps = !depArray
    const oldDeps = hooks[currentHookIndex]
    let hasChangedDeps = true
    if (oldDeps) {
      // 使用 node 的 deepEqual 或者 _.equals 来深度比较 dependency array 是否发生了变化
      try {
        assert.deepEqual(oldDeps, depArray)
        hasChangedDeps = false
      } catch (error) {
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