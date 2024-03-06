import { json } from '@sveltejs/kit'
import { PRIVATE_OPENAI_API_KEY } from '$env/static/private';
// import multipart from "parse-multipart"
export const POST = async ({request, fetch}) => {
    let response = {
        error: false,
        message: "success",
        text: ""
    }


    try {
        // fs.createReadStream('/Users/tulip/Downloads/Vocaroo 08 Feb 2024 14_59_48 MST 1lAQaRd07L5R.mp3')
        const reqBody = await request.formData()
        const reqFile = reqBody.get('file')

        // await console.log(reqFile.type)

        if (!reqFile) {
            throw new Error("Missing file upload")
        }

        // @ts-ignore
        const file = new Blob([reqFile], { type: reqFile.type });
        // const file = new Blob([reqFile], { type: 'audio/mpeg' });

        const formData = new FormData();
        formData.append('file', file, 'test.mp3');
        formData.append('model', 'whisper-1');
        // formData.append('language', 'en');

        const otherBody = JSON.stringify({
            file: file,
            model: "whisper-1"
        })

        const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PRIVATE_OPENAI_API_KEY}`,
            // 'Content-Type': 'multipart/form-data'
          },
          body: formData
        });
    
    
        const body = await res.json()
        
        if (res.status !== 200) {
            throw new Error(body.error.message)
        }

        response.message = "success"
        response.text = body.text
        return json(response, {
            status: 201
        })
    } catch (err) {
        response.error = true
        response.message = `${err}`
        return json(response, {
            status: 400
        })
    }



}