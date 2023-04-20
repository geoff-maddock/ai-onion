<script lang="ts">
	import Logo from '$lib/components/Logo.svelte'
	import Nav from '$lib/components/Nav.svelte'
</script>

<div class="header-container w-full">
	<div class="logo-container w-full">
		<div class="logo flex">
			<Logo />
			<div class="tagline flex">America's Finest AI News Source</div>
		</div>
		<div class="logo-center" />
		<div class="profile justify-right">
			<img src="images/ai-onion-profile.png" alt="Profile controls" />
		</div>
	</div>
</div>
<Nav />

<style>
	.tagline {
		line-height: 31px;
		max-height: 30px;
		padding-left: 16px;
		margin-top: 10px;
		margin-left: 16px;
		border-left: 1px solid #ccc;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: ElizabethSerif, Georgia, serif;
		font-style: italic;
		min-width: 16rem;
	}
	.header-container {
		position: relative;
		display: flex;
		height: 64px;
		-webkit-box-pack: justify;
		justify-content: space-between;
	}
	.logo-container {
		display: flex;
		align-items: center;
	}

	.logo {
		width: 600px;
	}

	.profile {
		width: 400px;
	}

	.logo-center {
		flex-grow: 1;
	}
</style>
