const React = (() => {
  let _val
  let _deps

  const useState = initialValue => {
    const state = _val || initialValue
    const setState = newState => {
      state = newState
    }
    return [state, setState]
  }

  const useEffect = (callback, depArray) => {
    const hasNoDeps = !depArray
    const hasChangedDeps = _deps ? depArray.some((dep, i) => dep !== _deps[i]) : true

    if (hasNoDeps || hasChangedDeps) {
      callback()
      _deps = depArray
    }
  }

  const render = (Component) => {
    const c = Component()
    c.render()
    return c
  }

  return { useState, useEffect, render }
})()