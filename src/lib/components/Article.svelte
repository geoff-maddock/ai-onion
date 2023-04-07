<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	import Image from './Image.svelte'
	export let type: ChatCompletionRequestMessageRoleEnum
	export let category: string
	export let message: string
	export let title: string
</script>

<div class="article {type === 'user' ? 'hidden' : 'visible'}">
	<Image url="https://dummyimage.com/645x362/ccc/fff.png" title="placeholder" />
	<div class="category">{category}</div>
	<h4 class="article-title">{title}</h4>
	<div class="article-body">
		{message}
	</div>
</div>
