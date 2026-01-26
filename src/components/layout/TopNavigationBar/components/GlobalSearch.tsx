import { useState, useRef, useEffect } from 'react'
import { Dropdown, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient'
import { useGlobalSearch, type SearchResult } from '@/hooks/useGlobalSearch'

/**
 * Get icon for search result type
 */
const getResultIcon = (type: SearchResult['type']): string => {
  switch (type) {
    case 'guest':
      return 'bx:user'
    case 'appointment':
      return 'bx:calendar'
    case 'case':
      return 'bx:briefcase'
    default:
      return 'bx:search'
  }
}

/**
 * Get color class for search result type
 */
const getResultColorClass = (type: SearchResult['type']): string => {
  switch (type) {
    case 'guest':
      return 'bg-soft-primary text-primary'
    case 'appointment':
      return 'bg-soft-info text-info'
    case 'case':
      return 'bg-soft-success text-success'
    default:
      return 'bg-soft-secondary text-secondary'
  }
}

interface SearchResultItemProps {
  result: SearchResult
  onSelect: () => void
}

const SearchResultItem = ({ result, onSelect }: SearchResultItemProps) => {
  const icon = getResultIcon(result.type)
  const colorClass = getResultColorClass(result.type)

  return (
    <Link 
      to={result.link} 
      className="dropdown-item py-2 border-bottom"
      onClick={onSelect}
    >
      <div className="d-flex align-items-center">
        <div className="flex-shrink-0 me-2">
          <div className="avatar-xs">
            <span className={`avatar-title ${colorClass} fs-16 rounded-circle`}>
              <IconifyIcon icon={icon} />
            </span>
          </div>
        </div>
        <div className="flex-grow-1 overflow-hidden">
          <h6 className="mb-0 text-truncate fs-14">{result.title}</h6>
          <span className="text-muted small text-truncate d-block">{result.subtitle}</span>
        </div>
      </div>
    </Link>
  )
}

interface SearchResultCategoryProps {
  title: string
  results: SearchResult[]
  onSelect: () => void
}

const SearchResultCategory = ({ title, results, onSelect }: SearchResultCategoryProps) => {
  if (results.length === 0) return null

  return (
    <div className="mb-2">
      <div className="px-3 py-1 bg-light">
        <small className="text-uppercase text-muted fw-semibold">{title}</small>
      </div>
      {results.map((result) => (
        <SearchResultItem key={result.id} result={result} onSelect={onSelect} />
      ))}
    </div>
  )
}

const GlobalSearch = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { results, totalResults, isLoading, hasError, searchEnabled } = useGlobalSearch(query)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.global-search-container')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Open dropdown when search results are available
  useEffect(() => {
    if (searchEnabled && (isLoading || totalResults > 0 || hasError)) {
      setIsOpen(true)
    } else if (!searchEnabled) {
      setIsOpen(false)
    }
  }, [searchEnabled, isLoading, totalResults, hasError])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleResultSelect = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div className="global-search-container position-relative">
      <form className="app-search d-none d-md-block me-auto" onSubmit={(e) => e.preventDefault()}>
        <div className="position-relative">
          <input 
            ref={inputRef}
            type="search" 
            className="form-control" 
            placeholder="Search guests, appointments, cases..." 
            autoComplete="off"
            value={query}
            onChange={handleInputChange}
            onFocus={() => searchEnabled && totalResults > 0 && setIsOpen(true)}
          />
          <IconifyIcon icon="solar:magnifer-outline" className="search-widget-icon" />
          {query && (
            <button 
              type="button"
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted p-0 me-2"
              onClick={handleClear}
              style={{ zIndex: 5 }}
            >
              <IconifyIcon icon="bx:x" className="fs-18" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div 
          className="position-absolute bg-white shadow rounded border mt-1" 
          style={{ 
            top: '100%', 
            left: 0, 
            right: 0, 
            minWidth: 320,
            maxWidth: 400,
            zIndex: 1050 
          }}
        >
          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" variant="primary" />
              <p className="mb-0 small text-muted mt-2">Searching...</p>
            </div>
          ) : hasError ? (
            <div className="text-center py-4 text-danger">
              <IconifyIcon icon="bx:error-circle" className="fs-24 mb-2" />
              <p className="mb-0 small">Search failed. Please try again.</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-4 text-muted">
              <IconifyIcon icon="bx:search-alt" className="fs-24 mb-2" />
              <p className="mb-0 small">No results found for "{query}"</p>
            </div>
          ) : (
            <SimplebarReactClient style={{ maxHeight: 350 }}>
              <SearchResultCategory 
                title="Guests" 
                results={results.guests} 
                onSelect={handleResultSelect}
              />
              <SearchResultCategory 
                title="Appointments" 
                results={results.appointments} 
                onSelect={handleResultSelect}
              />
              <SearchResultCategory 
                title="Cases" 
                results={results.cases} 
                onSelect={handleResultSelect}
              />
            </SimplebarReactClient>
          )}
          
          {totalResults > 0 && (
            <div className="text-center py-2 border-top bg-light">
              <small className="text-muted">
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GlobalSearch
