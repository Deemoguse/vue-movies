import { defineStore } from 'pinia';

const useAside = defineStore('aside', {
	state: () => ({
		open: true,
	}),
	actions: {
		openAside (): void {
			this.open = true;
		},
		closeAside (): void {
			this.open = false;
		},
		toggleAside (): void {
			this.open = !this.open;
		}
	}
});

export default useAside;