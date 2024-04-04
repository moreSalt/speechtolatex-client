// import { json, error } from '@sveltejs/kit'
// import { PUBLIC_API_URL } from '$env/static/public';
// import type { File, DefaultApiResponse } from '$lib/types/api';

// export const GET = async ({ fetch, cookies, params }) => {
//     try {
//         const auth = cookies.get("token")
//         if (!auth) error(401, {
//             message: "Auth not provided"
//         })

//         const res = await fetch(`${PUBLIC_API_URL}/storage/${params.slug}`, {
//             method: 'GET',
//             headers: {
//               Authorization: `Bearer ${auth}`
//             }
//         })

//         if (res.status !== 200) {
//             throw new Error("Unexpected status code " + res.status)
//         }
//         const body: DefaultApiResponse = JSON.parse(JSON.stringify(await res.json()))

//         return json(body)
//     } catch (err) {
//         await console.error(err)
//         error(500, {
//             message: `${err}`
//         })
//     }
// }

// export const POST = async ({ fetch, cookies, request, params }) => {
//     try {
//         const auth = cookies.get("token")
//         if (!auth) error(401, {
//             message: "Auth not provided"
//         })
//         const reqBody = await request.json()

//         if (!reqBody.latex) {
//             throw new Error("Latex field blank")
//         }

//         const res = await fetch(`${PUBLIC_API_URL}/storage`, {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${auth}`
//             },
//             body: JSON.stringify({
//                 id: parseInt(params.slug),
//                 latex: reqBody.latex
//             })
//         })

//         const body = await res.json()
//         await console.log(body)
//         if (res.status !== 201) {
//             throw new Error("Unexpected status code " + res.status)
//         }
//         // const body: File = JSON.parse(JSON.stringify(await res.json()))

//         return json({success: true})
//     } catch (err) {
//         await console.error(err)
//         error(500, {
//             message: `${err}`
//         })
//     }
// }

