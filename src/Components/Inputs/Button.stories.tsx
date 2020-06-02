import React from 'react'
import Button from './Button'
import '../../index.css'

export default {
  title: 'Button',
  components: Button,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

export const defaultView = () => (
  <Button onclick={() => alert('clicked!')}>Click me</Button>
)

export const disabled = () => <Button disabled={true}>Click me</Button>