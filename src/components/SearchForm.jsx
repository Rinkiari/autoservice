import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetSearch, searchBrands } from '../store/searchSlice'

const MIN_LENGTH = 3
const DEBOUNCE_MS = 500

export default function SearchForm() {
  const dispatch = useDispatch()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const number = query.trim()
    if (number.length < MIN_LENGTH) {
      dispatch(resetSearch())
      return
    }
    let request
    const timer = setTimeout(() => {
      request = dispatch(searchBrands(number))
    }, DEBOUNCE_MS)
    return () => {
      clearTimeout(timer)
      request?.abort()
    }
  }, [query, dispatch])

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="part-number" className="form-label fw-semibold">
        Артикул детали
      </label>
      <input
        id="part-number"
        type="search"
        className="form-control form-control-lg"
        placeholder="Например, 01089"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
        autoFocus
      />
      <div className="form-text">Поиск начнётся автоматически после ввода {MIN_LENGTH} символов.</div>
    </form>
  )
}
