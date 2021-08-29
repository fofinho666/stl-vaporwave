import React, { useEffect, useState } from "react"
import useWindowResize from '../hooks/useWindowResize'
import { randomBackgound, randomRange } from "../services/random"
import { useNProgress } from '@tanem/react-nprogress'
import { useKeys } from '../providers/keysProvider'

const Background = () => {
  const [style, setStyle] = useState({})
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const { backgroundKeypress } = useKeys()

  const loadImage = ({ width, height }) => {
    const img = new Image(width, height)
    const backgronudUrl = randomBackgound(width, height)

    img.src = backgronudUrl

    img.onload = () => {
      setStyle({ backgroundImage: `url(${backgronudUrl})` })
      setIsLoading(false)
    }

    setIsLoading(true)
  }

  useWindowResize((size) => {
    setSize(size)
    loadImage(size)
  })

  useEffect(() => {
    if (backgroundKeypress && !isLoading) {
      const height = size.height + randomRange(1, 2)
      loadImage({ ...size, height })
    }
  })

  return <>
    <LoadingBar isLoading={isLoading} />
    <div style={style} className="background" />
    <div className="layer" />
  </>
}

const LoadingBar = ({ isLoading }) => {
  const { animationDuration, isFinished, progress } = useNProgress({ isAnimating: isLoading })

  return (
    <div
      style={{
        opacity: isFinished ? 0 : 1,
        pointerEvents: 'none',
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      <div
        style={{
          position: 'fixed',
          background: 'red',
          top: 0,
          left: 0,
          height: 2,
          width: '100%',
          marginLeft: `${(-1 + progress) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`,
          zIndex: 1031,
        }}
      >
      </div>
    </div>
  )
}


export default Background
