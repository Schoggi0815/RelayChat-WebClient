export type ApiResponse<T> = Promise<
  | {
      ok: true
      data: T
    }
  | {
      ok: false
      error: string
      status: number
    }
>
