import React from 'react'
import MultiSelect from './MultiSelect'
import '../../index.css'

export default {
  title: 'MultiSelect',
  component: MultiSelect,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

const options = ['foo', 'bar', 'baz']
export const defaultView: React.FC = () => {
  return (
    <MultiSelect
      label="multiselect"
      options={options}
      placeholder="Select multiple items from options"
      onChange={(e: any) => console.log(e.target.value)}
    />
  )
}

export const preselected: React.FC = () => {
  return (
    <MultiSelect
      label="multiselect"
      options={options}
      values={['foo']}
      placeholder="Disabled"
    />
  )
}

export const disabled: React.FC = () => {
  return (
    <MultiSelect
      label="multiselect"
      options={options}
      disabled
      placeholder="Disabled"
    />
  )
}