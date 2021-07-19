/** @type {jest.Expect} */

import * as React from 'react'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Modal, ModalContents, ModalOpenButton} from '../modal'

// test.todo('can be opened and closed')
// 🐨 render the Modal, ModalOpenButton, and ModalContents
// 🐨 click the open button
// 🐨 verify the modal contains the modal contents, title, and label
// 🐨 click the close button
// 🐨 verify the modal is no longer rendered
// 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)

// setting up variables to communicate that these strings are the same
const label = "Modal Label"
const title = "Modal Title"
const content = "Modal content"

test('Modal can be opened and closed and displays content properly', () => {
  // render out the Modal component
  render(
    <Modal>
      <ModalOpenButton>
        <button>Open Modal</button>
      </ModalOpenButton>
      <ModalContents aria-label={label} title={title}>
        <div>{content}</div>
      </ModalContents>
    </Modal>
  )

  // open the modal
  userEvent.click(screen.getByRole('button', {name: /open modal/i}))

  // test what is on the modal
  const modal = screen.getByRole('dialog')
  expect(modal).toHaveAttribute('aria-label', label) //toHaveAttribute belongs to the jest-dom

  // test what is in the modal by scoping down the queries into the modal
  const inModal = within(modal)
  expect(inModal.getByRole('heading', {name: title})).toBeInTheDocument()
  expect(inModal.getByText(content)).toBeInTheDocument()

  // close the modal
  userEvent.click(inModal.getByRole('button', {name: /close/i}))

  // use queryByRole only when we are testing for non-existence
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()




screen.debug()
})

