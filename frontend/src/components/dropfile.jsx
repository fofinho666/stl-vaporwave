import React from 'react'
import Dropzone from 'react-dropzone'
import { postFiles } from '../services/filesApi'
import { useKeys } from '../providers/keysProvider'
import { useFiles } from '../providers/filesProvider'

export default function DropFile() {
  const { cameraKeypress } = useKeys()
  const { reloadFiles } = useFiles()

  const dropFiles = (files) => { postFiles(files).then(() => { reloadFiles() }) }

  return (
    <If condition={!cameraKeypress} >
      <Dropzone
        noClick
        onDrop={dropFiles}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="dropzone"
          >
            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>
    </If>
  )
}
