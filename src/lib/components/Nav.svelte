<script lang="ts">
</script>

<nav class="nav-container w-full">
	<a href="#" class="home"><span>HOME</span></a>
	<a href="#"><span>LATEST</span></a>
	<a href="#"><span>NEWS</span></a>
	<a href="#"><span>OPINION</span></a>
	<a href="#"><span>LOCAL</span></a>
	<a href="#"><span>POLITICS</span></a>
	<a href="#"><span>ENTERTAINMENT</span></a>
	<a href="#"><span>SPORTS</span></a>
	<a href="#"><span>VIDEO</span></a>
</nav>

<style>
	.nav-container {
		position: relative;
		display: flex;
		height: 24px;
		-webkit-box-pack: justify;
		justify-content: flex-start;
	}

	a.home {
		background: rgb(0, 107, 58);
	}

	a {
		display: flex;
		height: 100%;
		-webkit-box-align: center;
		align-items: center;
		text-transform: uppercase;
		padding: 0px 6px;
		transition: color 300ms ease 0s;
		white-space: nowrap;
		margin-right: 8px;
	}
	a span {
		display: flex;
		-webkit-box-align: center;
		align-items: center;
		color: rgb(0, 0, 0);
		font-size: 14px;
		font-weight: bold;
		height: 21px;
		line-height: 22px;
		letter-spacing: 1.27px;
	}
</style>
