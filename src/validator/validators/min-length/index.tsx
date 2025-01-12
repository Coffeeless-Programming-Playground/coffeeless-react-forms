import { MinLengthFieldError } from '../../errors'
import { FieldValidation } from '../../protocols'

export class MinLengthValidation implements FieldValidation {
  constructor(
    private readonly minLength: number,
    private readonly message?: string,
    public error: Error | null = null
  ) {}

  validate(inputValue: any, field: string): Error | null {
    if (inputValue && inputValue.length < this.minLength) {
      this.error = new MinLengthFieldError(field, this.minLength, this.message)
    } else {
      this.error = null
    }
    return this.error
  }
}
