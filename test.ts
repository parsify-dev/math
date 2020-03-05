import test from 'ava';

import parsifyMathPlugin from './src';

test('basic operations', async t => {
    t.is(await parsifyMathPlugin()('1+2'), 3);
    t.is(await parsifyMathPlugin()('5-2'), 3);
    t.is(await parsifyMathPlugin()('6*6'), 36);
    t.is(await parsifyMathPlugin()('5/2'), 2.5);
});

test('advanced operations', async t => {
    t.is(await parsifyMathPlugin()('sqrt(3^2 + 4^2)'), 5);
    t.is(await parsifyMathPlugin()('cos(45 deg)'), 0.7071067811865476);
    t.is(await parsifyMathPlugin()('x = 7 / 2'), 3.5);
    t.is(await parsifyMathPlugin()('x + 3'), 6.5);
});

test('units', async t => {
    t.is(await parsifyMathPlugin()('2 inch to cm'), '5.08 cm');
    t.is(await parsifyMathPlugin()('10 kilograms to g'), '10000 g');
    t.is(await parsifyMathPlugin()('15 cm to inch'), '5.905511811023622 inch');
    t.is(await parsifyMathPlugin()('12 hours to minutes'), '720 minutes');
});

test('currency conversion', async t => {
    t.regex(await (await parsifyMathPlugin({enableCurrencyConversion: true})('10 USD to PLN')).toString(), /PLN/);
    t.regex(await (await parsifyMathPlugin({enableCurrencyConversion: true})('5 EUR + 2 * 3 EUR in USD')).toString(), /USD/);
});

test('if an error occurs, just output the expression', async t => {
    t.is(await parsifyMathPlugin()('foo / bar'), 'foo / bar');
});