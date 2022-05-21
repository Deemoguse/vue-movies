<template lang="pug">
//- start
div(:class="$style.spinner")

//- end
</template>

<style lang="stylus" module>
.spinner
	width 48px
	height 48px
	border 5px solid var(--gray-200)
	border-bottom-color transparent
	border-radius 50%
	animation spin 1s linear infinite

	@keyframes spin {
		from { transform: translate(-50%, -50%) rotate(0deg); }
		to { transform: translate(-50%, -50%) rotate(360deg); }
	}
</style>