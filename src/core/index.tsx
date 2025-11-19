import React, { useState } from 'react'
import { FieldValidation } from 'coffeeless-react-validators'
import {
  recursivelyComputeValidation,
  stateSchemaUpdateDeepComparison,
  objectIterator
} from '../utils'
import '../css/main.css';

// map conditional types: https://stackoverflow.com/questions/49138332/typescript-mapped-types-flag-type-with-nesting
type FieldErrorMapping<T> = {
  [K in keyof T]?: T[K] extends object ? FieldErrorMapping<T[K]> : FieldValidation[];
}

type SkipValidationMapping<T> = {
  [K in keyof T]?: T[K] extends object ? SkipValidationMapping<T[K]> : boolean;
}

export interface CoffeelessValidator {
  field: any
  formState: {
    error: boolean
    formSubmitted: boolean
  }
}

interface CoffeFormProps<T> {
  children: React.ReactNode
  /** Represents the schema to map through and validate */
  initialValues: any
  /** Allows entering validation rules to input fields according to the entity state schema */
  validationSchema: FieldErrorMapping<T>
  /** Should only be used on forms where certain input validations are optional based on a condition. */
  skipSchemaValidation?: SkipValidationMapping<T>
}

interface ProviderProps<T> {
  validationState: T
  skipSchemaValidation?: SkipValidationMapping<T>
  /**
   * Sets the state of the Coffeeless validators which will be validated as the user types
   * @param e React.ChangeEvent<HTMLInputElement>
   */
  handleOnChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void
  /**
   * Used to validate form on submit
   * @param path is a string that represents the nested level path of validation.
   */
  validateFormOnSubmit: (path: string) => boolean
  formState: {
    error: boolean
    formSubmitted: boolean
  }
}

const initializer: ProviderProps<any> = {
  validationState: {
    any: []
  },
  skipSchemaValidation: {},
  handleOnChange: () => {},
  validateFormOnSubmit: (path: string) => false,
  formState: {
    error: false,
    formSubmitted: false
  }
}

const formContext = React.createContext<ProviderProps<any>>(initializer)

/**
 * Wrapper Component that uses React Context to manipulate the state of a form
 * @param initialValues is the state that you use in your react app. Represents the schema to map through and validate
 * @param validationSchema Allows entering validation rules to input fields according to the entity state schema
 * @param skipSchemaValidation Should only be used on forms where certain input validations are optional based on a condition.
 */
export function CoffeelessWrapper<T = any>({
  children,
  initialValues,
  validationSchema,
  skipSchemaValidation
}: CoffeFormProps<T>) {
  const [validationState, setValidationState] = useState<T | object>(validationSchema)
  const [formState, setFormState] = useState({
    error: false,
    formSubmitted: false
  })

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const [validations, path] = objectIterator(validationState, e.target.name)
    const [deepChild, _] = objectIterator(initialValues, e.target.name)

    validations.map((validation: FieldValidation) =>
      validation.validate(deepChild, path)
    ) as Array<Error | null>

    setValidationState(validationState)
  }

  function validateFormOnSubmit(path: string): boolean {
    const [deepStateChild, _] = objectIterator(initialValues, path)
    const [deepValidationState, _2] = objectIterator(validationState, path)
    const [deepSkipSchemaValidation, _3] = objectIterator(skipSchemaValidation, path)

    setFormState(prev => ({
      ...prev,
      formSubmitted: false
    }))

    const errorState = { error: false }

    recursivelyComputeValidation(
      deepStateChild,
      deepValidationState,
      deepSkipSchemaValidation,
      errorState
    )

    if (errorState.error) {
      setValidationState(validationState)
      setFormState({
        formSubmitted: true,
        error: true
      })
    } else {
      setFormState(prev => ({
        ...prev,
        formSubmitted: true
      }))
    }

    return errorState.error
  }

  stateSchemaUpdateDeepComparison(
    JSON.parse(JSON.stringify(initialValues)),
    validationState,
    validationSchema
  )

  return (
    <formContext.Provider
      value={{
        validationState,
        skipSchemaValidation,
        handleOnChange,
        validateFormOnSubmit,
        formState
      }}
    >
      {children}
    </formContext.Provider>
  )
}
/**
 * Provides the handleOnChange and validateFormOnSubmit. handleOnChange Sets the state of the
 * Coffeeless validators which will be validated as the user types. validateFormOnSubmit is used to validate form on submit.
 * This hook should be used inside the CForm and CInput to provide state validation on the fly and on submission.
 * @returns handleOnChange, validateFormOnSubmit
 */
export const useCoffeelessHandler = () => {
  const { handleOnChange, validateFormOnSubmit } = React.useContext(formContext)

  return {
    handleOnChange,
    validateFormOnSubmit
  }
}

/**
 * Provides the Context State which is composed of the formState that is used internally to set the state of the form
 * and the field property, which is retrieved based on the name of the field required to validate. This hook should be
 * used in the CInput to validate input state.
 * @param name string parameter that tells the coffeeless iterator where to look for validating nested state
 * @returns field and formState
 */
export const useCoffeelessValidator = (name: string | undefined = undefined) => {
  const { validationState, skipSchemaValidation, formState } = React.useContext(formContext)

  let copy: any[] = []
  let skipCopy: any[] = []

  if (name) {
    skipCopy = objectIterator(skipSchemaValidation, name)
    if (!skipCopy[0]) {
      copy = objectIterator(validationState, name)
    }
  }

  return {
    field: name && !skipCopy[0] && copy[0],
    formState
  }
}