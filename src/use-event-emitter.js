/* eslint-disable sort-imports */
import useEnvSense from "env-sense/build/use-env-sense.js"
import {useEffect, useLayoutEffect} from "react"

/**
 * @param {object} events
 * @param {string} event
 * @param {Function} onCalled
 * @returns {void}
 */
export default function useEventEmitter(events, event, onCalled) {
  const {isServer} = useEnvSense()
  const useWorkingEffect = isServer ? useEffect : useLayoutEffect

  // useLayoutEffect to connect after commit and disconnect on cleanup
  useWorkingEffect(() => {
    if (events) {
      events.addListener(event, onCalled)

      return () => {
        events.removeListener(event, onCalled)
      }
    }
  }, [events, event, onCalled])
}
