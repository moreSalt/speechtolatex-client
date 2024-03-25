import { error, json } from '@sveltejs/kit'
import { firestore } from '$lib/firebase/admin.js';
import { decode } from "jsonwebtoken";
import { convertFileType } from '$lib/utils/convert.js';
import type { FileFireStore, File } from '$lib/types/file.js';


export const GET = async ({request, fetch, cookies}) => {
    const token = cookies.get("token")
    if (!token) error(401)

    const payload = decode(token)
    if (!payload || typeof payload === "string" || !payload.user_id) error(401)

    const userId = payload.user_id

    const filesRef = await firestore.collection("files")
    const snapshot = await filesRef.get()
    const files: File[] = [];
    snapshot.forEach(doc => {

        // stringifying then parsing to cast to a different interface
        const data: FileFireStore = JSON.parse(JSON.stringify(doc.data()))
        if (data.userId === userId) {
            const file = convertFileType(data, doc.id)
            files.push(file)
        }

    })
    return json(files)

}

export const POST = async ({request, fetch, cookies}) => {
    const token = cookies.get("token")
    if (!token) error(401)

    const payload = decode(token)
    if (!payload || typeof payload === "string" || !payload.user_id) error(401)

    const userId = payload.user_id

    const filesRef = await firestore.collection("files").doc()

    const doc: File = {
        title: "NEW DOCUMENT",
        userId: userId,
        created: new Date(),
        updated: new Date()

    }
    const files = await filesRef.set(doc)
    return json(files)
}