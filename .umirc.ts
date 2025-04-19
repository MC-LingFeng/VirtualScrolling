import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '虚拟滚动（定高）',
      path: '/home',
      component: './Home',
    },
    {
      name: '虚拟滚动优化',
      path: '/optimization',
      component: './Access',
    },
  ],
  npmClient: 'yarn',
});
