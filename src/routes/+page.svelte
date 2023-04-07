<script lang="ts">
	import { onMount } from 'svelte'
	import Article from '$lib/components/Article.svelte'
	import Logo from '$lib/components/Logo.svelte'
	import type { ChatCompletionRequestMessage } from 'openai'
	import { SSE } from 'sse.js'
	import articles from '$lib/stores/stores.js'
	import articleImage from '$lib/stores/images.js'

	let article: string = ''

	let query: string = ''
	let answer: string = ''
	let imageUrl: string = ''
	let loading: boolean = false
	let chatMessages: ChatCompletionRequestMessage[] = []
	let scrollToDiv: HTMLDivElement

	onMount(async () => {
		console.log('onMount called')

		loading = true
		// mostly works well
		query =
			'Write the title for a humorous article in the style of The Onion in double quotes.  Then one single # character.  Then a 500 word humorous article based on the title.'
		// does not add the # character
		// query =
		// 	'Write a 500 word humorous article in the style of The Onion.  Desired format:  "Title of article" # Body of article.'
		chatMessages = [...chatMessages, { role: 'user', content: query }]

		// server sent events
		const eventSource = new SSE('/api/chat', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ messages: chatMessages })
		})

		eventSource.addEventListener('error', handleError)

		eventSource.addEventListener('message', (e) => {
			scrollToBottom()

			try {
				loading = false
				if (e.data === '[DONE]') {
					// log the full response from openAI
					console.log('response from openAI')
					console.log(answer)

					// updates the chat messages with the answer
					//chatMessages = [...chatMessages, { role: 'assistant', content: answer }]

					// set the article to the answer
					articles.set([answer])
					const title = getTitle(answer)
					answer = ''

					// get the image based on the title
					const imageUrl = getImage(title)
					//articleImage.set(imageUrl)
					console.log('image url return')
					console.log(imageUrl)
					return
				}

				const completionResponse = JSON.parse(e.data)
				const [{ delta }] = completionResponse.choices

				if (delta.content) {
					answer = (answer ?? '') + delta.content
				}
			} catch (err) {
				handleError(err)
			}
		})
		eventSource.stream()
		scrollToBottom()
	})

	// create an async function to get an image from the API with a string parameter
	async function getImage(prompt: string) {
		console.log('starting getImage function')
		const body = { prompt: prompt, n: 1, size: '1024x1024' }
		console.log(body)

		// use fetch to get the image
		const response = await fetch('/api/images', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})

		const data = await response.json()
		console.log(data)
		articleImage.set(data.url)
		return data.url
	}

	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
				inline: 'nearest'
			})
		}, 100)
	}

	function handleError<T>(err: T) {
		loading = false
		query = ''
		console.error(err)
	}

	function getTitle(content: string): string {
		// if content is empty, return empty string
		if (!content) {
			return ''
		}

		// split the title from the body
		var arr = content.split('#')
		var title = arr[0]

		// strip all quotes from the title
		title = title.replace(/"/g, '')

		return title
	}
	function getBody(content: string): string {
		// if content is empty, return empty string
		if (!content) {
			return ''
		}

		// split the title from the body
		var arr = content.split('#')

		return arr[1]
	}
</script>

<div class="flex flex-col pt-4 w-full px-8 items-center gap-2">
	<div>
		<h1 class="text-2xl font-bold w-full text-center"><Logo /></h1>
		<p class="text-sm italic">From THE CUTUPS METHOD</p>
	</div>
	<div class="w-full bg-white-900 rounded-md p-4 overflow-y-auto flex flex-col gap-4">
		<div class="flex flex-row gap-2">
			{#if $articles}
				{#each $articles as article}
					<Article
						title={getTitle(article)}
						category="Top Story"
						type="assistant"
						message={getBody(article)}
					/>
				{/each}
			{:else}
				<Article category="Breaking News" title="..." type="assistant" message="" />
			{/if}
			{#each chatMessages as message}
				<Article
					category="Breaking News"
					title={getTitle(message.content)}
					type={message.role}
					message={getBody(message.content)}
				/>
			{/each}
		</div>
		<div class="" bind:this={scrollToDiv} />
	</div>
</div>
