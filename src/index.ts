import {parser, format} from 'mathjs';

const mathParser = parser();

export default () => async (expression: string): Promise<string> => {
	try {
		// Replace word operators with sign ones
		expression = expression.replace('plus', '+');
		expression = expression.replace('minus', '-');
		expression = expression.replace('times', '*');
		expression = expression.replace('divided by', '/');

		const result = await mathParser.evaluate(expression);

		return format(result, {precision: 4});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return expression;
	}
};
