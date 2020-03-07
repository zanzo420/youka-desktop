import React from 'react';
import { search } from '@youka/youtube'
import { memoize, debounce } from 'lodash'
import { Link } from "react-router-dom"
import { Input } from 'semantic-ui-react'

const search_memoize = memoize(search)

export default function Search({ handleResults, handleLoading }) {
  function handleChange(e) {
    const query = e.target.value
    if (!query || query === '') return
    debouncedSearch(query)
  }

  async function doSearch(query) {
    handleLoading(true)
    try {
      const results = await search_memoize(query)
      const filteredResults = results.filter(r => !r.hours && (!r.minutes || r.minutes < 10))
      handleResults(filteredResults)
    } catch(error) {
      console.error(error)
    } finally {
      handleLoading(false)
    }
  }

  const debouncedSearch = debounce(doSearch, 500)

  return (
    <div className='flex flex-row w-full justify-between p-2 mb-2 bg-primary'>
      <Link className='self-center text-white font-bold text-3xl flex-1' to='/'>Youka</Link>
      <Input className='p-2 px-2 w-2/4 flex-2' type='text' onChange={handleChange} placeholder='Search'/>
      <div className='flex-1'></div>
    </div>
  )
}