<script lang="ts">
	import { onDestroy } from 'svelte'
	import { onMount } from 'svelte'
	import Article from '$lib/components/Article.svelte'
	import Logo from '$lib/components/Logo.svelte'
	import type { ChatCompletionRequestMessage } from 'openai'
	import { SSE } from 'sse.js'
	import articles from '$lib/stores/stores.js'

	let article: string = ''

	let query: string = ''
	let answer: string = ''
	let loading: boolean = false
	let chatMessages: ChatCompletionRequestMessage[] = []
	let scrollToDiv: HTMLDivElement

	onMount(async () => {
		console.log('onMount called')

		// check localStorage for existing article object
		// const existingArticle = localStorage.getItem('articles')

		// if (existingArticle !== null) {
		// 	const articleParsed = JSON.parse(existingArticle)
		// 	console.log('existing article found')
		// 	console.log(existingArticle)
		// 	console.log(articleParsed)
		// }

		loading = true
		query =
			'Write a 1000 word humourous article in the style of The Onion. Always place a single | character between the article title and the article body.'
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
					articles.set(answer)
					answer = ''
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

	// const getArticle = async() => {
	//     // get an article
	// )

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
		var arr = content.split('|')
		var title = arr[0]

		// remove quotes from title if they exist
		if (title.startsWith('"') && title.endsWith('"')) {
			title = title.substring(1, title.length - 1)
		}
		return title
	}
	function getBody(content: string): string {
		// if content is empty, return empty string
		if (!content) {
			return ''
		}

		// split the title from the body
		var arr = content.split('|')

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
				<Article
					title={getTitle($articles)}
					category="Top Story"
					type="assistant"
					message={getBody($articles)}
				/>
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
