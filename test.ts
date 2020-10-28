import test from 'ava';

import parsifyMathPlugin, {mathParser} from './src';

test('basic operations', async t => {
	t.is(await parsifyMathPlugin()('1+2'), '3');
	t.is(await parsifyMathPlugin()('5-2'), '3');
	t.is(await parsifyMathPlugin()('6*6'), '36');
	t.is(await parsifyMathPlugin()('5/2'), '2.5');
});

test('advanced operations', async t => {
	t.is(await parsifyMathPlugin()('sqrt(3^2 + 4^2)'), '5');
	t.is(await parsifyMathPlugin()('cos(45 deg)'), '0.7071');
	t.is(await parsifyMathPlugin()('x = 7 / 2'), '3.5');
	t.is(await parsifyMathPlugin()('x + 3'), '6.5');
});

test('word operators', async t => {
	t.is(await parsifyMathPlugin()('10 times 2'), '20');
	t.is(await parsifyMathPlugin()('2 minus 1'), '1');
	t.is(await parsifyMathPlugin()('10 plus 5'), '15');
	t.is(await parsifyMathPlugin()('6 divided by 3'), '2');
});

test('units', async t => {
	t.is(await parsifyMathPlugin()('2 inch to cm'), '5.08 cm');
	t.is(await parsifyMathPlugin()('10 kilograms to g'), '10000 g');
	t.is(await parsifyMathPlugin()('15 cm to inch'), '5.906 inch');
	t.is(await parsifyMathPlugin()('12 hours to minutes'), '720 minutes');
});

test('percentage value', async t => {
	t.is(await parsifyMathPlugin()('5% of 100'), '5');
	t.is(await parsifyMathPlugin()('(5 / 2)% of sin(2)'), '0.02273');
	t.is(await parsifyMathPlugin()('5% of 100 * 5'), '25');
});

test('adding percentage', async t => {
	t.is(await parsifyMathPlugin()('5% on 30'), '31.5');
	t.is(await parsifyMathPlugin()('(5 * 2)% on 30/3'), '11');
	t.is(await parsifyMathPlugin()('5% on cos(30)'), '0.162');
});

test('subtracting percentage', async t => {
	t.is(await parsifyMathPlugin()('6% off 40'), '37.6');
	t.is(await parsifyMathPlugin()('tan(6)% off 40/2'), '20.06');
	t.is(await parsifyMathPlugin()('6% off 40 + pi'), '40.55');
});

test('additional options', async t => {
	const result = await parsifyMathPlugin({
		precision: 16,
		customUnits: {
			knot: {
				definition: '0.514444m/s',
				aliases: ['knots']
			}
		}
	})('45 mile/hour to knots');

	t.is(result, '39.10396466865198 knots');
});

test('precision check', async t => {
	const result1 = await parsifyMathPlugin({precision: 6})('pi');
	const result2 = await parsifyMathPlugin({precision: 2})('pi');
	const result3 = await parsifyMathPlugin({precision: 10})('pi');

	t.is(result1, '3.14159');
	t.is(result2, '3.1');
	t.is(result3, '3.141592654');
});

test('exports parser instance', async t => {
	await parsifyMathPlugin()('x=3');

	t.is(mathParser.get('x'), 3);
});

test('if an error occurs, just output the expression', async t => {
	t.is(await parsifyMathPlugin()('foo / bar'), 'foo / bar');
});

test('DEBUG flag', async t => {
	process.env.DEBUG = 'true';
	t.is(await parsifyMathPlugin()('foo / bar'), 'Undefined symbol foo');
});
