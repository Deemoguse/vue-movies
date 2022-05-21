<template lang="pug">
//- start
div(:class="$style.container")
	AppSpinner(v-if="loading" :class="$style.spinner")

	div(v-if="error" :class="$style.error")
		| the picture didn't wake up :(

	img(
		ref="img"
		:class="$style.img"
		:src="src"
		:alt="alt"
		:hidden="loading || error"
	)

//- end
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import AppSpinner from './AppSpinner.vue';

export default defineComponent({
    props: {
        src: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: "",
        }
    },
    setup () {
        const img = ref<HTMLImageElement>();
        const error = ref<boolean>(false);
        const loading = ref<boolean>(true);

        function hideSpinner(): void {
            loading.value = false;
        }
        function onError(): void {
            hideSpinner();
            error.value = true;
        }

        onMounted(() => {
            img.value?.addEventListener("load", hideSpinner);
            img.value?.addEventListener("error", onError);
        });
        onUnmounted(() => {
            img.value?.removeEventListener("load", hideSpinner);
            img.value?.removeEventListener("error", onError);
        });

        return { img, error, loading };
    },
    components: { AppSpinner }
});
</script>

<style lang="stylus" module>
/* Box */
.container
	position relative
	display flex
	align-items center
	justify-content center
	width 100%
	height 100%
	overflow hidden

/* Image */
.img
	width 100%
	height 100%
	object-fit cover

/* Error */
.error
	font-family 'Koulen'
	font-size 20px
	color var(--red-100)

/* Spinner */
.spinner
	position absolute
	top 50%
	left 50%
	transform translate(-50%, -50%)

</style>