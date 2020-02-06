import {parser} from 'mathjs';

const mathParser = parser();

export default () => async (expression: string): Promise<string | number> => {
	try {
		const result = await mathParser.evaluate(expression);

		if (typeof result === 'object') {
			return result.toString();
		}

		return result;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return expression;
	}
};
