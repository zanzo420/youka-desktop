import '../lib/sentry'
import React, { useState, useEffect } from 'react';
import { Message, Icon } from 'semantic-ui-react'
import { ffmpegExists, downloadFfpmeg } from '../lib/mess'

export function initialized() {
  return ffmpegExists()
}

export default function InitPage() {
  const [initialized, setInitialized] = useState(ffmpegExists())
  const [error, setError] = useState()

  useEffect(() => {
    (async () => {
      try {
        if (!initialized) {
          await downloadFfpmeg()
        }
        setInitialized(true)
        window.location.reload()
      } catch (error) {
        setError(error.toString())
      }
    })()
  }, [])

  return (
    error ?
      <Message negative>
        <Message.Header>Ooops, some error occurred :(</Message.Header>
        <p>{error}</p>
      </Message>
      :
      <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Initializing</Message.Header>
        It may take a minute..
      </Message.Content>
      </Message>
  )
}