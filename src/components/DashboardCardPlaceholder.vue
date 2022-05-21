<template lang="pug">
//- start
div(:class="$style.container")
	AppSpinner(:class="$style.spinner")
//- end
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppSpinner from './AppSpinner.vue';

export default defineComponent({
    components: { AppSpinner }
});
</script>

<style lang="stylus" module>
/* Placeholder */
.container
	position relative
	border 3px solid #e9eff0
	border-radius 9px
	background-color #e9eff0

/* Spinner */
.spinner
	position absolute
	top 50%
	left 50%
	transform translate(-50%, -50%)

</style>