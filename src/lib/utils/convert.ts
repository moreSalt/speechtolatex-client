import type { FileFireStore, File } from "$lib/types/file"

export const convertFileType = (fireFile: FileFireStore, id: string): File => {
    const file: File = {
        id: id,
        title: fireFile.title,
        created: new Date(fireFile?.created._seconds * 1000).toISOString(),
        updated: new Date(fireFile?.updated._seconds * 1000).toISOString(),
        text: fireFile.text,
        latex: fireFile.latex,
        userId: fireFile.userId
    }
    return file
}