import { json, error } from '@sveltejs/kit'
import { PUBLIC_API_URL } from '$env/static/public';
import type { File, DefaultApiResponse } from '$lib/types/api';

export const GET = async ({ fetch, cookies, params }) => {
    try {
        const auth = cookies.get("token")
        if (!auth) error(401, {
            message: "Auth not provided"
        })

        const res = await fetch(`${PUBLIC_API_URL}/files/${params.slug}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${auth}`
            }
        })

        if (res.status !== 200) {
            throw new Error("Unexpected status code " + res.status)
        }
        const body: File = JSON.parse(JSON.stringify(await res.json()))

        return json(body)
    } catch (err) {
        await console.error(err)
        error(500, {
            message: `${err}`
        })
    }
}

export const PATCH = async ({ fetch, cookies, request, params }) => {
    try {
        const auth = cookies.get("token")
        if (!auth) error(401, {
            message: "Auth not provided"
        })
        const reqBody = await request.json()

        if (!reqBody.latex.includes("documentclass{article}")) {
            reqBody.latex = `\\documentclass{article}\\begin{document}${reqBody.latex}\\end{document}`
        }
        await console.log(reqBody)

        const res = await fetch(`${PUBLIC_API_URL}/files/${params.slug}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify(reqBody)
        })

        const body = await res.json()
        await console.log(body)
        if (res.status !== 200) {
            throw new Error("Unexpected status code " + res.status)
        }
        // const body: File = JSON.parse(JSON.stringify(await res.json()))

        return json({success: true})
    } catch (err) {
        await console.error(err)
        error(500, {
            message: `${err}`
        })
    }
}

export const DELETE = async ({ fetch, cookies, params, url }) => {
    try {
        const auth = cookies.get("token")
        if (!auth) error(401, {
            message: "Auth not provided"
        })
        await console.log(`${PUBLIC_API_URL}/files/${params.slug}`, params)
        const res = await fetch(`${PUBLIC_API_URL}/files/${params.slug}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${auth}`,
            }
        })

        if (res.status !== 200) {
            throw new Error("Unexpected status code " + res.status)
        }
        const body: DefaultApiResponse = JSON.parse(JSON.stringify(await res.json()))

        return json(body, {
            status: 200
        })
    } catch (err) {
        await console.error(err)
        error(500, {
            message: `${err}`
        })
    }
}