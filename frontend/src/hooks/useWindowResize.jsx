import { useEffect, useState } from "react"

export default function useWindowResize(callback) {
  const [windowSize, setWindowSize] = useState(null)

  const debounde = (fn) => {
    let timer
    return () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        fn.apply(this, arguments)
      }, 500)
    };
  }

  const getWindowSize = () => {
    const { innerWidth: width, innerHeight: height } = window
    return { width, height }
  }

  const handleResize = () => {
    const size = getWindowSize()
    setWindowSize(size)
    callback.call(this, { ...arguments, ...size })
  }

  useEffect(() => {
    if (!windowSize) {
      handleResize()
    }
    const handleResizeDebounde = debounde(handleResize)

    window.addEventListener("resize", handleResizeDebounde)
    return () => window.removeEventListener("resize", handleResizeDebounde)
  }, [])

  return windowSize
}