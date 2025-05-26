import { useState } from 'react'
import { AuxProps } from '../../ts/interfaces'
import { useCoffeelessHandler } from '../../core'

type Props = {
  preValidate?: () => boolean
  handleSubmit: () => void
  handleCancel?: (e: React.FormEvent<HTMLButtonElement>) => void
  changeTab?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, tab: string) => void
  submitText?: string
  tabs?: string[]
  selectedTab?: string
  formErrorMessage?: string
  includeFormButtons?: boolean
  errorClass?: string
  formWrapperClass?: string,
  displayInvalidForm?: boolean
}

const Form: React.FC<Props & AuxProps> = ({
  children,
  preValidate,
  handleSubmit,
  handleCancel,
  submitText,
  changeTab,
  tabs = [],
  selectedTab,
  formErrorMessage,
  includeFormButtons,
  errorClass,
  formWrapperClass,
  displayInvalidForm = true
}) => {
  const [invalidForm, setInvalidForm] = useState(false)
  const { validateFormOnSubmit } = useCoffeelessHandler()

  function handleSubmission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    let isFormInValid = false

    if (preValidate) {
      isFormInValid = preValidate()
    }

    if (isFormInValid) {
      validateFormOnSubmit('')
    } else {
      isFormInValid = validateFormOnSubmit('')
    }

    if (!isFormInValid) {
      handleSubmit()
    } else {
      setInvalidForm(true)
    }
  }

  return (
    <form onSubmit={handleSubmission}>
      {tabs.length ? (
        <>
          <ul className="nav nav-tabs">
            {tabs.map((tab, i) => (
              <li key={tab} className="nav-item">
                <a
                  onClick={e => {
                    changeTab!(e, tab)
                  }}
                  className={`nav-link ${selectedTab === tab && 'active'}`}
                  style={{ cursor: 'pointer' }}
                >
                  {tab}
                </a>
              </li>
            ))}
          </ul>
          <div className="tab-content" style={{ display: 'contents' }}>
            <div className={formWrapperClass || 'row'}>{children}</div>
          </div>
        </>
      ) : (
        <div className={formWrapperClass || 'row'}>{children}</div>
      )}

      {/* consider deleting this message when there are no more errors */}
      {invalidForm && displayInvalidForm && (
        <p className={errorClass || 'ml-1-error field-error'}>
          {formErrorMessage || 'Please fix the errors in the fields above'}
        </p>
      )}
      {includeFormButtons && (
        <div className="form-footer">
          <button type="submit" className="cofp-btn cofp-btn-primary">
            {submitText || 'Submit'}
          </button>

          <button onClick={handleCancel} className="cofp-btn cofp-btn-light">
            Cancel
          </button>
        </div>
      )}
    </form>
  )
}

export default Form
