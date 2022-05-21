import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/login.vue';
import RegisterPage from '@/views/register.vue';
import DashboardPage from '@/views/dashboard.vue';
import PostPage from '@/views/post.vue';

const router = createRouter({
	routes: [{
		name: 'login',
		component: LoginPage,
		path: '/login',
		meta: { layout: 'Auth' }
	}, {
		name: 'register',
		component: RegisterPage,
		path: '/register',
		meta: { layout: 'Auth' }
	}, {
		name: 'dashboard',
		component: DashboardPage,
		path: '/dashboard',
		meta: { layout: 'Main', protected: true }
	}, {
		path: '/post',
		redirect: '/dashboard',
	}, {
		name: 'post',
		component: PostPage,
		path: '/post/:id',
		props: true,
		meta: { layout: 'Main', protected: true },
	}],
	history: createWebHistory(),
});

export default router;