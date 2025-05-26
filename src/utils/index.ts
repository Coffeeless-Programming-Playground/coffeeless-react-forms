import { FieldValidation } from 'coffeeless-validator'

export const recursivelyComputeValidation = (
  deepStateChild: any,
  deepValidationState: any,
  deepSkipSchemaValidation: any,
  errorState: { error: boolean }
): any => {
  for (const [key, value] of Object.entries(deepValidationState)) {
    if (typeof (deepStateChild as any)[key] !== 'object') {
      if (!deepSkipSchemaValidation || !deepSkipSchemaValidation[key]) {
        const validationError = (
          (value as any).map((validation: FieldValidation) =>
            validation.validate(deepStateChild[key], key)
          ) as Array<Error | null>
        ).some((err: Error | null) => err !== null)
        errorState.error = !!(errorState.error || validationError)
      }
    } else {
      let skipValidation
      if (deepSkipSchemaValidation) {
        skipValidation = deepSkipSchemaValidation[key]
      }
      recursivelyComputeValidation(deepStateChild[key], value, skipValidation, errorState)
    }
  }
}

export const stateSchemaUpdateDeepComparison = (
  initialValues: any,
  state: any,
  schema: any
): any => {
  for (const [key, value] of Object.entries(schema)) {
    if (
      typeof (initialValues as any)[key] === 'object' &&
      typeof (initialValues as any)[key].length === 'number' &&
      state !== undefined &&
      schema !== undefined
    ) {
      // arrays can be added dynamically, it's necessary to deeply map both objects to update the state
      state[key] = [...schema[key]]
    } else {
      if (typeof (initialValues as any)[key] === 'object') {
        stateSchemaUpdateDeepComparison(initialValues[key], state[key], value)
      }
    }
  }
}

export const objectIterator = (state: any, path: string): any[] => {
  let copy = { ...state }

  if (path === '') return [copy, '']

  const updatePath = path.split('.')

  updatePath.forEach((path, idx) => {
    if (idx <= updatePath.length - 1 && copy !== undefined) {
      copy = (copy as any)[path]
    }
  })

  return [copy, updatePath[updatePath.length - 1]]
}
