<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	import Image from './Image.svelte'
	export let type: ChatCompletionRequestMessageRoleEnum
	export let category: string
	export let message: string
	export let title: string
	export let loading: boolean
	export let refresh = () => {}
</script>

<article class="article {type === 'user' ? 'hidden' : 'visible'} primary-article">
	<Image title="placeholder" />

	<div class="category flex">
		{category}
		<div class="loading-button ml-2">
			{#if loading}
				<button class="animate-character" title="Waiting for API data"> Loading...</button>
			{:else}
				<button on:click={refresh} title="Load a new article"> ↻</button>
			{/if}
		</div>
	</div>
	<h4 class="article-title">{title}</h4>
	<div class="article-body">
		{message}
	</div>
</article>

<style>
	.primary-article {
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgb(229, 229, 229);
		margin-bottom: calc(1.5rem - 1px);
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
</style>
