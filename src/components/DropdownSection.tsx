import type React from 'react'
import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'react-feather'

type DropdownSectionProps = {
  name: string
  backgroundColor?: string
  children: React.ReactNode
  isCollapsedAtStart?: boolean
}

function DropdownSection({
  name,
  backgroundColor = 'inherit',
  children,
  isCollapsedAtStart,
}: DropdownSectionProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(!isCollapsedAtStart)
  const handleOpen = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsDropDownOpen(true)
  }
  const handleClose = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsDropDownOpen(false)
  }
  return (
    <section className={`my-4 bg-${backgroundColor}`}>
      <div
        className={`flex sticky top-10 py-2 justify-between border-b border-solid border-black bg-${backgroundColor}`}
      >
        <h2 className="font-bold">{name}</h2>
        {isDropDownOpen ? (
          <button onClick={handleClose} aria-label="Collapse dropdown">
            <ChevronUp color="#C00" />
          </button>
        ) : (
          <button onClick={handleOpen} aria-label="Expand dropdown">
            <ChevronDown />
          </button>
        )}
      </div>
      {isDropDownOpen && children}
    </section>
  )
}

export default DropdownSection
