import {useQuery, useMutation, queryCache} from 'react-query'
import { query } from 'test/data/books'
import {client} from 'utils/api-client'
import {setQueryDataForBook} from 'utils/books'

function useListItems(user) {
    // 🐨 call useQuery to get the list item from the list-items endpoint
  // queryKey should be 'list-items'
  // queryFn should call the 'list-items' endpoint with the user's token
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
    // EC6: results from this queryKey is not shared between other queryKeys that can use the same data. Do so onSucess callback
    config: {
      onSuccess(listItems) {
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      }
    }
  })
 // useQuery is async call so it can be empty until its completed so we use ?? to set it to an empty array
  // until when its ready and rerenders
  return listItems ?? []
}

function useListItem(user, bookId) {
  // 🦉 NOTE: the backend doesn't support getting a single list-item by it's ID
  // and instead expects us to cache all the list items and look them up in our
  // cache. This works out because we're using react-query for caching!
  const listItems = useListItems(user)
  return listItems.find(li => li.bookId === bookId) ?? null
}

const defaultMutationOptions = {
      onError(err, variables, recover) {//the third arg:snapshotValue is whatever that is returned from onMutate
        // eventhough React Query is going to restore the old values after our failed request due to the queryCache.invalidateQueries, we want to be explicit about it and go ahead and do it right away
        console.log('I ran')
        if (typeof recover === 'function') recover() // if a recover function is present run it
      },
      onSettled() {queryCache.invalidateQueries('list-items')},
    }

function useUpdateListItem(user, options) {
   // 🐨 call useMutation here
  // the mutate function should call the list-items/:listItemId endpoint with a PUT
  //   and the updates as data. The mutate function will be called with the updates
  //   you can pass as data.
  // 💰 if you want to get the list-items cache updated after this query finishes
  // the use the `onSettled` config option to queryCache.invalidateQueries('list-items')
  // The useMutation will update the list-item:id's notes data, persisting it
  return useMutation(updates => client(
    `list-items/${updates.id}`, {
      method: 'PUT',
      token: user.token,
      data: updates,
    }), {
      // EC7: Optimistic UI
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData('list-items')
        // we assume that the update is going to be successful and instead of waiting for the response we go ahead and update the queryCache ourselves
        queryCache.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item
          })
        })
        return () => queryCache.setQueryData('list-items', previousItems)  // recovery function in event of error
      },
      ...defaultMutationOptions,
      ...options
    })
}

// 🐨 call useMutation here and assign the mutate function to "remove"
// the mutate function should call the list-items/:listItemId endpoint with a DELETE
function useRemoveListItem(user, options) {
  return useMutation(
      ({id}) =>
        client(`list-items/${id}`, {
          method: 'DELETE',
          token: user.token,
        }), {
          onMutate(removedItem) {
            const previousItems = queryCache.getQueryData('list-items')
            queryCache.setQueryData('list-items', old => {
              return old.filter(item => item.id !== removedItem.id)
            })
            return () => queryCache.setQueryData('list-items', previousItems) // recovery function in event of error
          },
          ...defaultMutationOptions,
          ...options
        }
    )
}

  // 🐨 call useMutation here and assign the mutate function to "create"
  // the mutate function should call the list-items endpoint with a POST
  // and the bookId the listItem is being created for.
function useCreateListItem(user, options) {
  return  useMutation(
    // the mutation function: A function that performs an asynchronous task and returns a promise. which is then returned as the first item in the array (create in our case)
    ({bookId}) => {
      return client('list-items', {
        data: {bookId},
        token: user.token
      })}, {...defaultMutationOptions, ...options}
  )
}

export {useListItems, useListItem, useUpdateListItem, useCreateListItem, useRemoveListItem}