import { error, json } from '@sveltejs/kit'
import { firestore } from '$lib/firebase/admin.js';
import { redirect } from '@sveltejs/kit';
import { decode } from "jsonwebtoken";
import type { File, FileFireStore } from "$lib/types/file.js"
import { convertFileType } from '$lib/utils/convert.js';


export const GET = async ({request, fetch, cookies, url, params}) => {
    const token = cookies.get("token")
    if (!token) error(401)

    const payload = decode(token)
    if (!payload || typeof payload === "string" ||!payload.user_id) error(401)

    const userId = payload.user_id

    const filesRef = await firestore.collection("files").doc(params.slug)
    const snapshot = await filesRef.get()
    const data: FileFireStore = JSON.parse(JSON.stringify(snapshot.data()))

    if (data.userId === userId) {
        const document = convertFileType(data, snapshot.id)
        return json(document)
    } else {
        error(403)
    }
}

export const DELETE = async ({cookies, params}) => {
    const token = cookies.get("token")
    if (!token) error(401)
    const payload = decode(token)
    if (!payload || typeof payload === "string" ||!payload.user_id) error(401)
    const userId = payload.user_id

    // Fetch the file to check the userId
    const filesRef = await firestore.collection("files").doc(params.slug)
    const snapshot = await filesRef.get()
    const data: FileFireStore = JSON.parse(JSON.stringify(snapshot.data()))

    if (data.userId === userId) {
        const document = convertFileType(data, snapshot.id)
        // return json(document)

        const res = await filesRef.delete()
        return json({
            success: true
        })
    } else {
        error(403)
    }


}

export const PATCH = async ({request, fetch, cookies, url, params}) => {
    const token = cookies.get("token")
    if (!token) error(401)
    const payload = decode(token)
    if (!payload || typeof payload === "string" ||!payload.user_id) error(401)
    const userId = payload.user_id


    const reqBody = await request.json()
    // await console.log(reqBody)

    // Fetch the file to check the userId
    const filesRef = await firestore.collection("files").doc(params.slug)
    const snapshot = await filesRef.get()
    const data: FileFireStore = JSON.parse(JSON.stringify(snapshot.data()))

    if (data.userId === userId) {
        const document = convertFileType(data, snapshot.id)
        // return json(document)

        const res = await filesRef.update(reqBody)
        return json({
            success: true
        })
    } else {
        error(403)
    }
}

export const POST = async ({request, fetch, cookies}) => {
    const token = cookies.get("token")
    if (!token) error(401)

    const payload = decode(token)
    if (!payload || !payload.user_id) error(401)

    const userId = payload.user_id

    const filesRef = await firestore.collection("files").doc()
    const files = await filesRef.set({
        ts: new Date(),
        userId: userId,
        title: "NEW TEXT TO LATEX FILE"
    })


    // await docRef.set({
    //     first: 'Ada',
    //     last: 'Lovelace',
    //     born: 1815
    //   });
    return json(files)
    // await console.log(request.headers.get("cookie"))
    // redirect(302, `/files/${Math.floor(Math.random() * 1000)}`)

}