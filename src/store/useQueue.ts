import { defineStore } from 'pinia';

const useQueue = defineStore('queue', {
	state: () => ({
		queueValue: 0,
	}),
	actions: {
		increment () {
			this.queueValue += 1;
		},
		decrement () {
			this.queueValue -= 1;
		}
	}
});

export default useQueue;