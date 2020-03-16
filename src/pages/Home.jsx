import '../lib/sentry'
import React, { useState, useEffect } from 'react';
import { memoize } from 'lodash'
import { utils, trending } from '@youka/youtube'
import { Loader } from 'semantic-ui-react'
import Search from '../comps/Search'
import VideoList from '../comps/VideoList'
import { usePageView } from '../lib/hooks'

const trending_memoize = memoize(trending)


export default function HomePage() {
  usePageView()

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)


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