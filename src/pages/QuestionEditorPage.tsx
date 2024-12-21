import React, { useEffect, useState, useRef } from 'react'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ApiStatus, MatchFormFieldConfig, MatchFormGroupConfig } from '../model'
import { buildMatchForm, updateMatchFormConfig } from '../api/matchFormConfig'
import DropdownSection from '../components/DropdownSection'
import FieldWrapper from '../components/FieldWrapper'
import Field from '../components/Inputs/Field'
import Button from '../components/Inputs/Button'
import { ErrorRetry } from '../components/ErrorRetry'
import { AlertCircle, Check, Loader } from 'react-feather'
import { getShowIfFields } from '../utils'
import { ShowIfBuilder } from '../components/ShowIfBuilder'
import { PublishMatchForm } from '../components/PublishMatchForm'

interface DragItem {
  id: number
  index: number
  groupId: number
  type: string
}

function FieldItem({
  field,
  index,
  groupId,
  moveField,
  setFields,
  setConfirmDisabled,
}: {
  field: MatchFormFieldConfig
  index: number
  groupId: number
  moveField: (dragIndex: number, hoverIndex: number, groupId: number) => void
  setFields: React.Dispatch<React.SetStateAction<MatchFormFieldConfig[]>>
  setConfirmDisabled: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [, ref] = useDrag({
    type: 'field',
    item: { id: field.id, index, groupId },
  })

  const [, drop] = useDrop<DragItem>({
    accept: 'field',
    hover: (item) => {
      if (item.index !== index || item.groupId !== groupId) {
        moveField(item.index, index, groupId)
        item.index = index
      }
    },
  })

  return (
    <div
      ref={(node) => ref(drop(node))}
      style={{
        marginBottom: '8px',
        border: '1px solid lightgrey',
        padding: '8px',
      }}
    >
      <FieldWrapper key={field.id} isShowing>
        <Field
          config={{
            type: field.type,
            options: field.options,
            label: field.label,
            name: field.id.toString(),
            disabled: false,
          }}
        />
        <div className="mt-4">
          <h1>Show If: </h1>
          <ShowIfBuilder
            matchFormFields={[]}
            showIfFields={{}}
            currentField={field}
            setFields={setFields}
            setConfirmDisabled={setConfirmDisabled}
          />
        </div>
      </FieldWrapper>
    </div>
  )
}

function QuestionEditorPage() {
  const [fields, setFields] = useState<MatchFormFieldConfig[]>([])
  const [originalFields, setOriginalFields] = useState<MatchFormFieldConfig[]>(
    []
  )
  const [groups, setGroups] = useState<MatchFormGroupConfig[]>([])
  const [loadingStatus, setLoadingStatus] = useState<ApiStatus>('not started')
  const [confirmDisabled, setConfirmDisabled] = useState(true)
  const [confirmStatus, setConfirmStatus] = useState<ApiStatus>('not started')
  const timerIdRef = useRef<NodeJS.Timer | null>(null)

  const loadMatchForm = () => {
    setLoadingStatus('sending')
    buildMatchForm(false)
      .then((res) => {
        setFields(res.fields)
        setOriginalFields(res.fields)
        setGroups(res.groups)
        setLoadingStatus('success')
      })
      .catch(() => setLoadingStatus('error'))
  }

  const moveField = (
    dragIndex: number,
    hoverIndex: number,
    groupId: number
  ) => {
    const fieldsWithinGroup = fields.filter((f) => f.groupId === groupId)
    const dragField = fieldsWithinGroup[dragIndex]
    const newFields = [...fields]
    const fromIndex = fields.findIndex((f) => f.id === dragField.id)
    const [removed] = newFields.splice(fromIndex, 1)
    newFields.splice(fromIndex + hoverIndex - dragIndex, 0, removed)
    setFields(newFields)
    setConfirmDisabled(false)
  }

  const confirm = () => {
    setConfirmStatus('sending')
    updateMatchFormConfig({ groups, fields })
      .then(() => setConfirmStatus('success'))
      .catch(() => {
        setFields(originalFields)
        setConfirmStatus('error')
      })
      .finally(
        () =>
          (timerIdRef.current = setTimeout(
            () => setConfirmStatus('not started'),
            3000
          ))
      )
  }

  useEffect(() => {
    loadMatchForm()
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current as unknown as number)
      }
    }
  }, [])

  if (loadingStatus === 'not started' || loadingStatus === 'sending') {
    return <div>Loading...</div>
  } else if (loadingStatus === 'error') {
    return <ErrorRetry retry={loadMatchForm} />
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen pb-8">
        <section className="h-full overflow-scroll">
          <div className="top-0 sticky bg-white px-8 py-2">
            <h1 className="uppercase text-primary font-bold z-10">
              <span>Question List</span>
            </h1>
          </div>
          <div className="px-8 pb-4">
            <div className="flex items-center justify-between">
              <PublishMatchForm />
              <div className="flex items-center">
                {confirmStatus === 'sending' ? (
                  <Loader className="mr-2" />
                ) : confirmStatus === 'success' ? (
                  <h2 className="text-base text-green-600 mr-4 flex">
                    <Check />
                    Updated Successfully
                  </h2>
                ) : (
                  confirmStatus === 'error' && (
                    <h2 className="text-base text-red-600 mr-4 flex">
                      <AlertCircle />
                      Updated Unsuccessfully
                    </h2>
                  )
                )}
                <Button disabled={confirmDisabled} onClick={confirm}>
                  Confirm
                </Button>
              </div>
            </div>
            {groups.map((group) => (
              <DropdownSection
                key={group.id}
                backgroundColor="bg-white"
                name={group.name || 'General'}
                isCollapsedAtStart
              >
                {fields
                  .filter((field) => field.groupId === group.id)
                  .map((field, index) => (
                    <FieldItem
                      key={field.id}
                      field={field}
                      index={index}
                      groupId={group.id}
                      moveField={moveField}
                      setFields={setFields}
                      setConfirmDisabled={setConfirmDisabled}
                    />
                  ))}
              </DropdownSection>
            ))}
          </div>
        </section>
      </div>
    </DndProvider>
  )
}

export default QuestionEditorPage
