<template lang="pug">
//- start
div(:class="$style.box")
	slot

//- end
</template>

<style lang="stylus" module>
/* Box */
.box
	padding 20px 30px
	border 3px solid #e9eff0
	border-radius 9px
	background-color var(--white)
</style>