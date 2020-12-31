import styled from '@emotion/styled/macro'
import { keyframes } from '@emotion/core'
import {FaSpinner} from 'react-icons/fa'
import {Dialog as ReachDialog} from '@reach/dialog'
import * as colors from 'styles/colors'
import * as mq from 'styles/media-queries'

// 🐨 create a button styled component here called "Button"
// make it look nice and allow it to support a "variant" prop which can be
// either "primary" or "secondary".
// 💰 don't forget to export it at the bottom!
// 💰 In my final version, I style padding, border, lineHeight, and borderRadius
//    the same for both types, and then change the background and color based
//    on the given variant.
// 🦉 remember, you don't have to make things look perfect or just like they
// do in the final example. Just make sure you understand how to create the
// styled component and accept a prop to change which styles apply.

// 🐨 Feel free to create as many reusable styled components here as you'd like
// 💰 in my finished version I have: Button, Input, CircleButton, Dialog, FormGroup

// 🎨 here are a bunch of styles you can copy/paste if you want
// Button:
//   padding: '10px 15px',
//   border: '0',
//   lineHeight: '1',
//   borderRadius: '3px',
const buttonVariant = {
  primary: {
    background: colors.indigo,
    color: colors.base,
  },
  secondary: {
      background: colors.gray,
      color: colors.text,
  }
}

// Button variant="primary" (in addition to the above styles)
//   background: '#3f51b5',
//   color: 'white',

// Button variant="secondary" (in addition to the above styles)
//   background: '#f1f2f7',
//   color: '#434449',

const Button = styled.button`
  padding: 10px 15px;
  border: 0;
  line-height: 1;
  border-radius: 3px;
  background: ${({variant = 'primary'}) => buttonVariant[variant].background};
  color: ${({variant = 'primary'}) => buttonVariant[variant].color}
`

// Input
//   borderRadius: '3px',
//   border: '1px solid #f1f1f4',
//   background: '#f1f2f7',
//   padding: '8px 12px',

const Input = styled.input`
  border-radius: 3px;
  border: 1px solid ${colors.gray10};
  background: ${colors.gray};
  padding: 8px 12px;
`
// FormGroup
//   display: 'flex',
//   flexDirection: 'column',

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

// 💰 I'm giving a few of these to you:
const CircleButton = styled.button({
  borderRadius: '30px',
  padding: '0',
  width: '40px',
  height: '40px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
  color: colors.text,
  border: `1px solid ${colors.gray10}`,
  cursor: 'pointer',
})

const Dialog = styled(ReachDialog)({
  maxWidth: '450px',
  borderRadius: '3px',
  paddingBottom: '3.5em',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
  margin: '20vh auto',
  [mq.small]: {
    width: '100%',
    margin: '10vh auto',
  },
})

const rotate = keyframes`
  0% {
    transform: rotate(0)
  }
  50% {
    transform: rotate(1turn)
  }
  100% {
    transform: rotate(3turn)
  }
`

const Spinner = styled(FaSpinner)`
  animation: ${rotate} 5s linear infinite;
`

Spinner.defaultProps = {
  'aria-label': 'loading'
}

export {Button, Input, FormGroup, CircleButton, Dialog, Spinner}
