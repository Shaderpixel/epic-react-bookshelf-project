/** @jsx jsx */
// comment before this is for using the css prop
import {jsx, css} from '@emotion/core'

// 🐨 let's get a solid reset of global styles so everything looks a bit better
// In this project we're using bootstrap-reboot which you can import from
// bootstrap/dist/css/bootstrap-reboot.css
import 'bootstrap/dist/css/bootstrap-reboot.css'
// 🦉 Note: you can definitely use regular styles to style React apps
// and using any modern toolchain will allow you to simply import the CSS file
// but CSS-in-JS is generally easier to maintain.
import '@reach/dialog/styles.css'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {Button, Input, FormGroup, Spinner} from './components/lib'
import {Modal, ModalContents, ModalOpenButton} from './components/modal'
import {Logo} from './components/logo'

function LoginForm({onSubmit, submitButton}) {
  function handleSubmit(event) {
    event.preventDefault()
    const {username, password} = event.target.elements

    onSubmit({
      username: username.value,
      password: password.value,
    })
  }

  return (
    <form onSubmit={handleSubmit} css={css`
      display: flex;
      flex-direction: column;
      align-items: stretch;
      > div {
        margin: 10px auto;
        width: 100%;
        max-width: 300px;
      }
    `}>
      <FormGroup>
        <label htmlFor="username">Username</label>
        <Input id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" />
      </FormGroup>
      <div>
        {React.cloneElement(submitButton, {type: 'submit'})}
        <Spinner css={css`margin-left: 1em;`} />
      </div>
    </form>
  )
}

function App() {
  function login(formData) {
    console.log('login', formData)
  }

  function register(formData) {
    console.log('register', formData)
  }

  return (
    <div css={css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100vh;
    `}>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div css={css`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-gap: 0.75rem
      `}>
        <Modal>
          <ModalOpenButton>
            <Button variant="primary">Login</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form" title="Login">
            <LoginForm
              onSubmit={login}
              submitButton={<Button variant="primary">Login</Button>}
            />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">Register</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Registration form" title="Register">
            <LoginForm
              onSubmit={register}
              submitButton={<Button variant="secondary">Register</Button>}
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
