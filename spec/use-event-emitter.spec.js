import {EventEmitter} from "events"
import React from "react"
import TestRenderer,{act} from "react-test-renderer"

import useEventEmitter from "../src/use-event-emitter.js"

/**
 * @param {{emitter: EventEmitter | null, event: string, onCalled: Function}} props
 * @returns {null}
 */
function TestComponent({emitter, event, onCalled}) {
  useEventEmitter(emitter, event, onCalled)

  return null
}

/**
 * @param {{emitter: EventEmitter | null, event: string, onCalled: Function}} props
 * @returns {TestRenderer.ReactTestRenderer}
 */
function renderComponent({emitter, event, onCalled}) {
  return TestRenderer.create(
    React.createElement(TestComponent, {
      emitter,
      event,
      onCalled
    })
  )
}

describe("useEventEmitter", () => {
  it("attaches and removes listeners", () => {
    const emitter = new EventEmitter()
    const onCalled = jasmine.createSpy("onCalled")
    let renderer

    act(() => {
      renderer = renderComponent({emitter, event: "ping", onCalled})
    })

    emitter.emit("ping")
    expect(onCalled).toHaveBeenCalledTimes(1)

    act(() => {
      renderer.unmount()
    })

    emitter.emit("ping")
    expect(onCalled).toHaveBeenCalledTimes(1)
  })

  it("updates listeners when the event changes", () => {
    const emitter = new EventEmitter()
    const onCalled = jasmine.createSpy("onCalled")
    let renderer

    act(() => {
      renderer = renderComponent({emitter, event: "alpha", onCalled})
    })

    act(() => {
      renderer.update(
        React.createElement(TestComponent, {
          emitter,
          event: "beta",
          onCalled
        })
      )
    })

    emitter.emit("alpha")
    emitter.emit("beta")

    expect(onCalled).toHaveBeenCalledTimes(1)
  })

  it("updates listeners when the emitter changes", () => {
    const emitterA = new EventEmitter()
    const emitterB = new EventEmitter()
    const onCalled = jasmine.createSpy("onCalled")
    let renderer

    act(() => {
      renderer = renderComponent({emitter: emitterA, event: "ready", onCalled})
    })

    act(() => {
      renderer.update(
        React.createElement(TestComponent, {
          emitter: emitterB,
          event: "ready",
          onCalled
        })
      )
    })

    emitterA.emit("ready")
    emitterB.emit("ready")

    expect(onCalled).toHaveBeenCalledTimes(1)
  })

  it("skips wiring when the emitter is missing", () => {
    const onCalled = jasmine.createSpy("onCalled")
    let renderer

    act(() => {
      renderer = renderComponent({emitter: null, event: "ping", onCalled})
    })

    act(() => {
      renderer.unmount()
    })

    expect(onCalled).not.toHaveBeenCalled()
  })
})
