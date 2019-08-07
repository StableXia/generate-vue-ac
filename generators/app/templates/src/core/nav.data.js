/*
NavNode:
{
  navId: string,
  icon: string,
  text: string,
  route?: string,
  children?: NavNode[],
}
 */

export default {
	navId: '__root',
	children: [
		{
			navId: 'test',
			icon: 'apple',
			text: '测试',
			route: '/test',
		},
	],
};
