import React, { Suspense, useEffect, useRef, useState } from 'react'
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { useFrame, useLoader } from '@react-three/fiber'
import { randomColor, randomRange, randomSpeed } from '../services/random'
import { useKeys } from '../providers/keysProvider'
import { useFiles } from '../providers/filesProvider'

export default function ModelGenerator() {
  const [speed, setSpeed] = useState(randomSpeed())
  const [positons, setPositons] = useState([])
  const { reloadKeypress } = useKeys()
  const [ reload, setReloading ] = useState(false)
  const { files, reloadFiles } = useFiles()

  const deboundeReload = () => {
    setReloading(true)
    setTimeout(() => { setReloading(false) }, 250)
  }

  useEffect(() => {
    if (reloadKeypress && files.length !== 0 && ! reload) {
      reloadFiles()
      setSpeed(randomSpeed())
      setPositons([])
      deboundeReload()
    }
  })

  useEffect(() => {
    if (positons.length === 0 && files.length !== 0) {
      setPositons(files.map((_, index) => modelPosition(index)))
    }
  })

  const modelPosition = (index) => index === 0 ? [0, 0, randomRange(-100, 300)] : [
    randomRange(-100, 100),
    randomRange(-200, 200),
    randomRange(-100, 300)
  ]

  return <>
    <If condition={files.length > 0}>
      <For each="file" index="index" of={files}>
        <Suspense key={index} fallback={null}>
          <Model
            url={file}
            speed={randomSpeed()}
            position={positons[index]}
          />
        </Suspense>
      </For>
    </If>
  </>
}

const Model = ({ url, position, speed }) => {
  const [color] = useState(randomColor())
  const { cameraKeypress } = useKeys()

  const geom = useLoader(STLLoader, url)
  const mesh = useRef()
  useFrame(() => cameraKeypress ? null : (
    mesh.current.rotation.x = mesh.current.rotation.y = mesh.current.rotation.z += speed
  ))

  return <>
    <mesh position={position} ref={mesh} >
      <primitive object={geom} attach="geometry" />
      <meshStandardMaterial color={color} specular={0x111111} shininess={200} />
    </mesh>
  </>
}
