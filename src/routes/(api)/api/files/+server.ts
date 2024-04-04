// import { json, error } from '@sveltejs/kit'
// import { PUBLIC_API_URL } from '$env/static/public';
// import type { File, DefaultApiResponse } from '$lib/types/api';

// export const GET = async ({ fetch, cookies }) => {
//     try {
//         const auth = cookies.get("token")
//         if (!auth) error(401, {
//             message: "Auth not provided"
//         })

//         const res = await fetch(`${PUBLIC_API_URL}/files`, {
//             method: 'GET',
//             headers: {
//               Authorization: `Bearer ${auth}`
//             }
//         })

//         if (res.status !== 200) {
//             throw new Error("Unexpected status code " + res.status)
//         }
//         const body: File[] = JSON.parse(JSON.stringify(await res.json()))

//         return json(body)
//     } catch (err) {
//         await console.error(err)
//         error(500, {
//             message: `${err}`
//         })
//     }
// }

// export const POST = async ({ fetch, cookies }) => {
//     try {
//         const auth = cookies.get("token")
//         if (!auth) error(401, {
//             message: "Auth not provided"
//         })

//         const res = await fetch(`${PUBLIC_API_URL}/files`, {
//             method: 'POST',
//             headers: {
//               Authorization: `Bearer ${auth}`,
//               "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 title: "New file",
//                 text: "",
//                 latex: ""
//             })
//         })

//         if (res.status !== 201) {
//             throw new Error("Unexpected status code " + res.status)
//         }
//         const body: DefaultApiResponse = JSON.parse(JSON.stringify(await res.json()))

//         return json(body, {
//             status: 201
//         })
//     } catch (err) {
//         await console.error(err)
//         error(500, {
//             message: `${err}`
//         })
//     }
// }