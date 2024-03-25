// API routes for Firebase Storage
import { error, json } from "@sveltejs/kit";
import { bucket } from "$lib/firebase/admin.js";
import { decode } from "jsonwebtoken";
// GET: Get a file
export const GET = async ({ request, params, cookies, url }) => {
    const id = url.searchParams.get("id");
    if (!id) error(401);

    const file = bucket.file(`latex-pdfs/Hw7_Sp24_Student-1.pdf`);

    // Generate a signed URL for read access
    const signedUrls = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
    });

    const fileUrl = signedUrls[0];

    return json({
        url: fileUrl,
    });
};

export const POST = async ({ request, url }) => {
    return json({});
};
