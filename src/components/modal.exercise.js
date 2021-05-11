/** @jsx jsx */
import {jsx} from '@emotion/core'
// 🐨 you're going to need the Dialog component
// It's just a light wrapper around ReachUI Dialog
// 📜 https://reacttraining.com/reach-ui/dialog/
import React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog, CircleButton} from './lib'

//It's going to be a function that accepts any number of functions. That's going to return a function, and this function is going to accept any number of arguments.
//When this function is called, it's going to take all of those functions that we had in the first place. For each of those functions, if that function exists, then we'll call that function with the args.
const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(args) )

// 💰 Here's a reminder of how your components will be used:
/*
<Modal>
  <ModalOpenButton>
    <button>Open Modal</button>
  </ModalOpenButton>
  <ModalContents aria-label="Modal label (for screen readers)">
    <ModalDismissButton>
      <button>Close Modal</button>
    </ModalDismissButton>
    <h3>Modal title</h3>
    <div>Some great contents of the modal</div>
  </ModalContents>
</Modal>
*/

// we need this set of compound components to be structurally flexible
// meaning we don't have control over the structure of the components. But
// we still want to have implicitly shared state, so...
// 🐨 create a ModalContext here with React.createContext
const ModalContext = React.createContext()

// 🐨 create a Modal component that manages the isOpen state (via useState)
// and renders the ModalContext.Provider with the value which will pass the
// isOpen state and setIsOpen function
function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />
  )
}


// 🐨 create a ModalDismissButton component that accepts children which will be
// the button which we want to clone to set it's onClick prop to trigger the
// modal to close
// 📜 https://reactjs.org/docs/react-api.html#cloneelement
// 💰 to get the setIsOpen function you'll need, you'll have to useContext!
// 💰 keep in mind that the children prop will be a single child (the user's button)
const ModalDismissButton = ({children: child}) => {
  const [, setIsOpen] = React.useContext(ModalContext)
  return (
    React.cloneElement(child, {onClick: callAll(() => setIsOpen(false), child.props.onClick)}) // we clone the children instead of calling the children directly because we didn't want to pass the children in as a prop and we don't want to overwrite and refs or listeners that could have been set on it. This gives the greatest flexibility
  )
}

// 🐨 create a ModalOpenButton component which is effectively the same thing as
// ModalDismissButton except the onClick sets isOpen to true
const ModalOpenButton = ({children: child}) => {
  const [, setIsOpen] = React.useContext(ModalContext)
  return (
    React.cloneElement(child, {onClick: callAll(() => setIsOpen(true), child.props.onClick)})
  )
}

// 🐨 create a ModalContents component which renders the Dialog.
// Set the isOpen prop and the onDismiss prop should set isOpen to close
// 💰 be sure to forward along the rest of the props (especially children).
const ModalContentsBase = (props) => {
  const [isOpen, setIsOpen] = React.useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={()=>setIsOpen(false)} {...props} />
  )
}

const ModalContents = ({title, children, ...restProps}) => {
  const circleDismissButton = (<div css={{display: 'flex', justifyContent: 'flex-end'}}>
      <ModalDismissButton>
        <CircleButton>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </CircleButton>
      </ModalDismissButton>
    </div>)
  return (
    <ModalContentsBase {...restProps} >
      {circleDismissButton}
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

// 🐨 don't forget to export all the components here
export {Modal, ModalDismissButton, ModalOpenButton, ModalContents, ModalContentsBase}