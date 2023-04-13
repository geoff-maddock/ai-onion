<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	import Image from './Image.svelte'
	export let type: ChatCompletionRequestMessageRoleEnum
	export let category: string
	export let message: string
	export let title: string
</script>

<article class="article {type === 'user' ? 'hidden' : 'visible'} primary-article">
	<Image url="https://dummyimage.com/645x362/ccc/fff.png" title="placeholder" />
	<div class="category">{category}</div>
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
</style>
