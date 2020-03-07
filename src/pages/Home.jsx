import React, { useState, useEffect } from 'react';
import { memoize } from 'lodash'
import { utils, trending } from '@youka/youtube'
import { Message, Icon, Loader } from 'semantic-ui-react'
import Search from '../comps/Search'
import VideoList from '../comps/VideoList'
import { ffmpegExists, downloadFfpmeg } from '../lib/mess'


const trending_memoize = memoize(trending)
const ffmpeg_exists_memoize = memoize(ffmpegExists)

export default function HomePage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(ffmpeg_exists_memoize())
  const [error, setError] = useState()

  function handleResults(results) {
    setResults(results)
  }

  function handleLoading(value) {
    setLoading(value)
  }

  useEffect(() => {
    (async function () {
      const results = await trending_memoize()
      setResults(utils.cleanResults(results))
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        if (!initialized) {
          await downloadFfpmeg()
        }
        setInitialized(true)
      } catch (error) {
        setError(error.toString())
      }
    })()
  }, [])

  if (error) {
    return (
      <Message negative>
        <Message.Header>Ooops, some error occurred :(</Message.Header>
        <p>{error}</p>
      </Message>
    )
  }

  if (!initialized) {
    return (
      <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Initializing</Message.Header>
          It may take a minute..
        </Message.Content>
      </Message>
    )
  }

  return (
    <div>
      <Search handleResults={handleResults} handleLoading={handleLoading} />
      {
        results.length && !loading ?
          <VideoList videos={results} /> :
          <Loader active inline='centered' />
      }
    </div>
  )
}