export interface File {
    created: string
    id: number
    latex?: string
    text?: string
    title: string
    updated: string
    userId: string
}

export interface DefaultApiResponse {
    message: string
    id?: number | string
    url?: string
    error?: string
}