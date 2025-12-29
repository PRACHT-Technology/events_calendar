"use client"

import { useQueryStates, parseAsArrayOf, parseAsString } from 'nuqs'

const filterParser = parseAsArrayOf(parseAsString, ',').withDefault([])

export function useFilterParams() {
  const [filters, setFilters] = useQueryStates(
    {
      location: filterParser,
      category: filterParser,
    },
    {
      history: 'push',
      shallow: true,
    }
  )

  const setLocationFilter = (locations: string[]) =>
    setFilters({ location: locations.length ? locations : null })

  const setCategoryFilter = (categories: string[]) =>
    setFilters({ category: categories.length ? categories : null })

  const clearAllFilters = () =>
    setFilters({ location: null, category: null })

  return {
    locationFilter: filters.location,
    categoryFilter: filters.category,
    setLocationFilter,
    setCategoryFilter,
    clearAllFilters,
  }
}
