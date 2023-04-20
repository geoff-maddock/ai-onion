<script lang="ts">
	import { onMount } from 'svelte'
	import Article from '$lib/components/Article.svelte'
	import Header from '$lib/components/Header.svelte'
	import type { ChatCompletionRequestMessage } from 'openai'
	import { SSE } from 'sse.js'
	import articles from '$lib/stores/stores.js'
	import { defaultValue } from '$lib/stores/stores.js'
	import articleImage from '$lib/stores/images.js'

	let article: string = ''
	let query: string = ''
	let answer: string = ''
	let imageUrl: string = ''
	let loading: boolean = false
	let chatMessages: ChatCompletionRequestMessage[] = []
	let scrollToDiv: HTMLDivElement

	onMount(async () => {
		console.log('on app mount')

		if (window.localStorage.getItem('articles') == defaultValue) {
			console.log('loading initial article')
			loading = true
			// mostly works well
			query =
				'Write the title for a humorous article in the style of The Onion in double quotes.  Then one single # character.  Then a 300 word humorous article based on the title.'
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
				// scrollToBottom()

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
		}
		// scrollToBottom()
	})

	async function refreshArticle() {
		console.log('refreshArticle called')
		loading = true
		// mostly works well
		query =
			'Write the title for a humorous article in the style of The Onion in double quotes.  Then one single # character.  Then a 300 word humorous article based on the title.'

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
			try {
				if (e.data === '[DONE]') {
					// log the full response from openAI
					console.log('response from openAI')
					console.log(answer)

					// set the article to the answer
					articles.set([answer])
					const title = getTitle(answer)
					answer = ''

					// get the image based on the title
					const imageUrl = getImage(title)
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
	}

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

		articleImage.set(data.url)
		loading = false
		return data.url
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
	<Header />
	<section id="container" class="w-full">
		<div class="grid-container">
			{#if $articles}
				{#each $articles as article}
					<Article
						title={getTitle(article)}
						category="Top Story"
						type="assistant"
						message={getBody(article)}
						refresh={refreshArticle}
						{loading}
					/>
				{/each}
			{:else}
				<Article
					category="Breaking News"
					title="..."
					type="assistant"
					message=""
					refresh={refreshArticle}
					{loading}
				/>
			{/if}
			{#each chatMessages as message}
				<Article
					category="Breaking News"
					title={getTitle(message.content)}
					type={message.role}
					message={getBody(message.content)}
					refresh={refreshArticle}
					{loading}
				/>
			{/each}

			<!-- Example article sub-sections -->
			<article class="grid-article-section">
				<div class="grid-article-image">
					<img
						alt="Default placeholder"
						src="https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,g_center,h_191,q_60,w_340/50deabc8293cf2bd78f5a05d0113c5a8.jpg"
					/>
				</div>
				<div class="grid-article-title">
					<div class="category mb-1">BREAKING NEWS</div>
					<h4>Midwest Battered By Beautiful Weather</h4>
				</div>
			</article>

			<!-- Vertical seperator -->
			<div class="grid-vertical-seperator" />
			<!-- Example article second column -->
			<div id="grid-second-column">
				<div class="grid-article-title article-seperator">
					<div class="category mb-1">LOCAL</div>
					<h4 class="secondary-title">
						San Francisco Realtor Shows Couple Earning Under 6-Figure Salary Around Neighborhood’s
						Best Tent City
					</h4>
					<p class="secondary-body">
						SAN FRANCISCO—Saying this was by far the best option given their financial situation,
						San Francisco real estate agent Harry Evans reportedly showed a couple earning a
						sub-six-figure salary Wednesday around the neighborhood’s best tent city. “So we…
					</p>
				</div>
				<div class="grid-article-title article-seperator">
					<div class="category mb-1">LOCAL</div>
					<h4 class="secondary-title">Uncle’s Dating Advice Sex Crime</h4>
					<p class="secondary-body">
						JEFFERSON CITY, MO—Pulling aside his nephew and providing him with completely
						unsolicited guidance, local uncle Mitch Fulton, 55, reportedly offered dating advice
						Tuesday that qualified as a sex crime. “He asked me if I wanted a sip of his beer and…
					</p>
				</div>
				<div class="grid-article-title article-seperator">
					<div class="category mb-1">LOCAL</div>
					<h4 class="secondary-title">
						Airline Forced To Remove Sober Buzzkill From Flight To Las Vegas
					</h4>
					<p class="secondary-body">
						ATLANTA—After law enforcement escorted a passenger off the plane and charged him with
						orderly conduct, United Airlines confirmed Wednesday that it had been forced to remove
						sober buzzkill Ted Barnwell from a flight to Las Vegas. “During our…
					</p>
				</div>
			</div>
			<div class="grid-vertical-seperator" />
			<div id="grid-third-column">
				<div class="grid-article-title article-seperator">
					<img
						alt="people onion"
						class="grid-article-image-top"
						src="https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,g_center,h_416,q_60,w_740/a1glirmtpgnnrgkq96yv.jpg"
					/>
					<div class="category mb-1">AMERICAN VOICES</div>
					<h4 class="secondary-title">
						Man Charged After Taking Kidnapped Platypus On Train, Shopping Tripgas
					</h4>
				</div>
				<div class="grid-article-title article-seperator">
					<img
						alt="people onion"
						class="grid-article-image-top"
						src="https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,g_center,h_416,q_60,w_740/027824824ca2c2927043294d5a7f27c4.jpg"
					/>
					<div class="category mb-1">BREAKING NEWS</div>
					<h4 class="secondary-title">Men Explain How They Think An Abortion Works</h4>
				</div>
				<div class="grid-article-title article-seperator">
					<img
						alt="people onion"
						class="grid-article-image-top"
						src="https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,g_center,h_362,q_60,w_645/939ee66e0351c38d3e1c4d5d341d6051.jpg"
					/>
					<div class="category mb-1">BREAKING NEWS</div>
					<h4 class="secondary-title">
						Dalai Lama Admits He Felt Left Out Being Only Leader Of Major Religion Not To Molest
						Someone
					</h4>
				</div>
			</div>
		</div>
		<div class="" bind:this={scrollToDiv} />
	</section>
</div>

<style>
	#container {
		display: block;
	}

	.loading-button {
		position: relative;
		right: 60px;
	}

	.animate-character {
		text-transform: uppercase;
		background-image: linear-gradient(-225deg, #231557 0%, #44107a 29%, #55ad0c 67%, #fff800 100%);
		background-size: auto auto;
		background-clip: border-box;
		background-size: 200% auto;
		color: #fff;
		background-clip: text;
		text-fill-color: transparent;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: textclip 2s linear infinite;
		display: inline-block;
		font-family: 'Libre Baskerville', serif;
	}

	@keyframes textclip {
		to {
			background-position: 200% center;
		}
	}

	.grid-vertical-seperator {
		grid-row: span 3 / auto;
		width: 1px;
		height: 100%;
		margin: 0px;
		background: rgb(229, 229, 229);
	}

	.grid-article-loading {
		display: flex;
		flex-wrap: nowrap;
		grid-column: 1 / 2;
		order: 1;
		box-sizing: content-box;
	}

	.grid-article-section {
		display: flex;
		flex-wrap: nowrap;
		grid-column: 1 / 2;
		order: 2;
		box-sizing: content-box;
	}

	.grid-article-image {
		width: calc(301px - 0rem);
		margin-left: 16px;
	}
	.grid-article-title {
		order: -1;
		flex: 1 1 0%;
	}

	.grid-container {
		grid-template-columns: calc(634px) 0px calc(301px) 0px calc(301px);
		column-gap: 16px;
		display: grid;
		grid-auto-flow: dense;
	}

	#grid-second-column {
		grid-column: 3 / 4;
		grid-row: span 3 / auto;
	}

	.secondary-title {
		font-size: calc(15px);
		line-height: calc(24px);
		margin-bottom: 0.25rem;
		color: rgb(34, 34, 34);
		font-family: 'Libre Baskerville', serif;
		text-align: left;
		margin-top: 0px;
		font-weight: 700;
	}

	.secondary-body {
		margin-bottom: 0.25rem;
		font-size: calc(16px);
		line-height: calc(24px);
		color: rgb(34, 34, 34);
		font-family: Georgia, serif;
		text-align: left;
	}

	#grid-third-column {
		grid-column: 5 / 6;
		grid-row: span 3 / auto;
	}

	.article-seperator {
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgb(229, 229, 229);
		margin-bottom: calc(1.5rem - 1px);
	}
</style>
