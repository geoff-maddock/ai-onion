<script lang="ts">
	import articleImage from '$lib/stores/images.js'
	export let title: string

	function handleImgError() {
		console.log('error')
		$articleImage = 'images/empty-article-image.svg'
	}
</script>

<picture class="article-image-container">
	<source media="(min-width:800px)" srcset={$articleImage} class="article-image" />
	<img src={$articleImage} class="article-image" alt={title} on:error={handleImgError} />
</picture>

<style>
	.article-image-container {
		width: 362px;
		height: 362px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.article-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
