import { json } from '@sveltejs/kit'
import { PRIVATE_OPENAI_API_KEY } from '$env/static/private';
// import multipart from "parse-multipart"
export const POST = async ({request, fetch}) => {
    let response = {
        error: false,
        message: "success",
        latex: ""
    }


    try {
        

        const data = await request.json()
        if (!data || !data.text) {
            throw new Error("Invalid text provided")
        }

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PRIVATE_OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    "model": "gpt-3.5-turbo-0125",
                    "messages": [
                        {
                            "role": "system",
                            "content": "Your job is to convert plain text to the Latex format. This should include all of the requirements a Latex file has to properly render."
                        },
                        {
                            "role": "user",
                            "content": data.text
                        }
                    ]
            })
        });
    
    
        const body = await res.json()
        


        if (res.status !== 200 || body.choices.length < 1) {
            throw new Error(body.error ? body.error.message : body)
        }

        response.message = "success"
        response.latex = body.choices[0].message.content

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