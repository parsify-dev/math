import {parser, format, createUnit, UnitDefinition} from 'mathjs';

const mathParser = parser();

interface Options {
	precision?: number;
	customUnits?: {
		[name: string]: UnitDefinition;
	};
}

export default ({precision = 4, customUnits}: Options = {}) => async (expression: string): Promise<string> => {
	try {
		// Replace word operators with sign ones
		expression = expression.replace(/plus|and|with /, '+');
		expression = expression.replace(/minus|subtract|without/, '-');
		expression = expression.replace(/times|multiplied by/, '*');
		expression = expression.replace('divided by', '/');
		expression = expression.replace('mod', '%');

		if (customUnits) {
			createUnit(customUnits, {override: true});
		}

		const result = await mathParser.evaluate(expression);

		return format(result, {precision});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return expression;
	}
};

export {
	mathParser
};
