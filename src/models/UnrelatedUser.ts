export type UnrelatedUser = {
  displayName: string
}

export const isUnrelateUser = (value: unknown): value is UnrelatedUser =>
  typeof value === 'object' &&
  value != null &&
  'displayName' in value &&
  typeof value.displayName === 'string'
