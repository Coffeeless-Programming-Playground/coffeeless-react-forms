import { FieldValidation } from 'coffeeless-validator'

// map conditional types: https://stackoverflow.com/questions/49138332/typescript-mapped-types-flag-type-with-nesting
export type FieldErrorMapping<T> = {
  [K in keyof T]?: T[K] extends object ? FieldErrorMapping<T[K]> : FieldValidation[]
}

export type SkipValidationMapping<T> = {
  [K in keyof T]?: T[K] extends object ? SkipValidationMapping<T[K]> : boolean
}
