import sayHello from './modules/components/Chart';

test('should return Hello World!', () => {
	expect(sayHello()).toBe('Hello World!');
});
