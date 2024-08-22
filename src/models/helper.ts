export const isObject = (
  value: unknown
): value is Record<string | number | symbol, unknown> =>
  typeof value === 'object' && value != null

export type TypeOfTypes =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function'

type TypeString<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends symbol
  ? 'symbol'
  : never

export const hasProp = <TObject, TName extends keyof TObject>(
  value: Record<string | number | symbol, unknown>,
  propertyName: TName,
  type: NoInfer<TypeString<TObject[TName]>>
) => propertyName in value && typeof value[propertyName] === type
