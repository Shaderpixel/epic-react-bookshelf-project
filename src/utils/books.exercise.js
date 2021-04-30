import {useQuery, queryCache} from 'react-query'
import {client} from './api-client'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const getBookSearchConfig = (query, user) => ({
  queryKey: ['bookSearch', {query}],
  //Since query keys uniquely describe the data they are fetching, they should include any variables you use in your query function that change, this way the results are cached and future queries are faster
  //https://react-query.tanstack.com/guides/query-keys
  queryFn: () => client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.books),
  // EC6: results from this queryKey is not shared between other queryKeys that can use the same data. Do so onSucess callback
  config: {
    onSuccess(books) {
      for (const book of books) {
        setQueryDataForBook(book)
      }
    }
  }
})

function useBookSearch(query, user) {
  // 🐨 replace this useAsync call with a useQuery call to handle the book search
  // the queryKey should be ['bookSearch', {query}]
  const result = useQuery(getBookSearchConfig(query, user))
  return {...result, books: result.data ?? loadingBooks}
}

function useBook(bookId, user) {
  // similar to const book = data?.book ?? loadingBook
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token: user.token}).then(data => data.book)
  })

  return data ?? loadingBook
}

function refetchBookSearchQuery(user) {
  // this addresses EC5 where react query shows the old result for a brief moment while it invalidates the old query and goes and fetches the new result
  // remove all the bookSearch queries
  // regardless of what the booksearch and specific query combination is
  queryCache.removeQueries('bookSearch')
  // this allows us to cache a new set of query when we leave the book page instead of doing a new query when we go back to the discover screen
  queryCache.prefetchQuery(getBookSearchConfig('', user))
}

function setQueryDataForBook(book, data) {
  queryCache.setQueryData(['book', {bookId: book.id}], data ? data : book)
}

export {useBookSearch, useBook, refetchBookSearchQuery, setQueryDataForBook}