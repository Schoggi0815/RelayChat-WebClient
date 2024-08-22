export class FetchError extends Error {
  code: number

  constructor(message: string, code: number) {
    super(message)
    this.name = 'ValidationError'
    this.code = code
  }
}
