import React from 'react'
import Background from './background'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useContextBridge } from '@react-three/drei'
import DropFile from './dropfile'
import ModelGenerator from './modelGenerator'
import KeysPovider, { KeysContext } from '../providers/keysProvider'
import FilesPovider, { FilesContext } from '../providers/filesProvider'

export default function App() {

  return <KeysPovider>
    <FilesPovider>
      <Background />
      <CanvasContext shadowMap camera={{ position: [0, 0, 400], far: 4500 }}>
        <ambientLight intensity={0.75} />
        <pointLight intensity={1} position={[-10, -25, -10]} />
        <spotLight
          castShadow
          intensity={2.25}
          angle={0.2}
          penumbra={1}
          position={[25, 25, 25]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableDamping
          dampingFactor={0.5}
          rotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <ModelGenerator />
      </CanvasContext>
      <DropFile />
    </FilesPovider>
  </KeysPovider>
}

function CanvasContext({ children, ...props }) {
  const ContextBridge = useContextBridge(KeysContext, FilesContext)

  return <Canvas {...props}>
    <ContextBridge>
      {children}
    </ContextBridge>
  </Canvas>

}