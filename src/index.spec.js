import sayHello from './modules/components/ChartBox';

test('should return Hello World!', () => {
	expect(sayHello()).toBe('Hello World!');
});
