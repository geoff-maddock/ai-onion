import { OPENAI_KEY } from '$env/static/private'
import { type CreateImageRequest, Configuration, OpenAIApi } from 'openai'
import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import type { Config } from '@sveltejs/adapter-vercel'

export const config: Config = {
	runtime: 'edge'
}

export const POST: RequestHandler = async ({ request }) => {

	try {
		if (!OPENAI_KEY) {
			throw new Error('OPENAI_KEY env variable not set')
		}

		const requestData = await request.json()

		if (!requestData) {
			throw new Error('No request data')
		}
		const configuration = new Configuration({
			apiKey: OPENAI_KEY,
		});
		const openai = new OpenAIApi(configuration)

		const prompt: CreateImageRequest = {
			prompt: requestData.prompt,
			n: requestData.n,
			size: requestData.size,
		}

		const response = await openai.createImage(prompt)

		const image_url = response.data.data[0].url;
		const imageJson = JSON.stringify({ url: image_url })

		return new Response(imageJson, {
			headers: {
				'Content-Type': 'text/json'
			}
		})
	} catch (err) {
		console.error(err)
		return json({ error: 'There was an error processing your request' }, { status: 500 })
	}
}
