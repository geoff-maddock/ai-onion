<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	export let type: ChatCompletionRequestMessageRoleEnum
	export let category: string
	export let message: string
	export let title: string
</script>

<div class="article {type === 'user' ? 'hidden' : 'visible'}">
	<div class="category">{category}</div>
	<h4 class="article-title">{title}</h4>
	<div class="article-body">
		{message}
	</div>
</div>
