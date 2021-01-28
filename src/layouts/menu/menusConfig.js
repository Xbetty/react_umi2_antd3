export const menuArr = [
  {
    key: '/home',
    name: '主页',
    icon: 'appstore',
  },
  {
    key: '/activityManage',
    name: '活动管理',
    icon: 'shop',
    children: [
      { key: '/activityList', name: '活动列表'},
    ],
  },
];
