import { json } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit';
export const GET = async ({request, fetch}) => {
    redirect(302, `/files/${Math.floor(Math.random() * 1000)}`)

}