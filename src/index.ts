import {parser, format} from 'mathjs';

const mathParser = parser();

export default () => async (expression: string): Promise<string> => {
	try {
		const result = await mathParser.evaluate(expression);

		return format(result, {precision: 4});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return expression;
	}
};
