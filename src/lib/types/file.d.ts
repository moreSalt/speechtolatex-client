// Formatted document
export interface File {
    id?: string
    title: string
    created: string | Date
    updated: string | Date
    text?: string
    latex?: string
    userId: string
}



// document that comes from Firestore, needs to be converted
export interface FileFireStore {
    title: string
    created: TimeStamp
    updated: TimeStamp
    text?: string
    latex?: string
    userId: string
}


export interface TimeStamp {
    _seconds: number
    _nanoseconds: number
}
  
  