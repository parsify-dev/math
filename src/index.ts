import {parser, format, createUnit, UnitDefinition, Parser} from 'mathjs';

import {getElementIndex} from './utils/get-element-index';

const mathParser = parser();

interface Options {
	precision?: number;
	customUnits?: Record<string, UnitDefinition>;
}

export default ({precision = 4, customUnits}: Options = {}) => async (expression: string): Promise<string> => {
	try {
		// Replace word operators with sign ones
		expression = expression.replace(/plus|and|with /, '+');
		expression = expression.replace(/minus|subtract|without/, '-');
		expression = expression.replace(/times|multiplied by/, '*');
		expression = expression.replace('divided by', '/');
		expression = expression.replace('mod', '%');

		// Percentage operations
		if (/ off? | on /.exec(expression) && !expression.includes('"')) {
			let updatedExpression = '';
			const expressionArray = expression.split(' ');
			const number = (name: string) => expressionArray.slice(0, getElementIndex(expressionArray, name)).join(' ').replace('%', '');
			const total = (name: string) => expressionArray.slice(getElementIndex(expressionArray, name) + 1).join(' ');

			if (/ of /.exec(expression)) {
				updatedExpression = `((${number('of')}) / 100) * (${total('of')})`;
			} else if (/ on /i.exec(expression)) {
				updatedExpression = `(${total('on')}) + ((${number('on')}) / 100) * (${total('on')})`;
			} else if (/ off /i.exec(expression)) {
				updatedExpression = `(${total('off')}) - ((${number('off')}) / 100) * (${total('off')})`;
			}

			// Validate percentage operations
			if (await mathParser.evaluate(updatedExpression).toString().includes('*') === false) {
				expression = updatedExpression;
			}
		}

		if (customUnits) {
			createUnit(customUnits, {override: true});
		}

		return format(await mathParser.evaluate(expression), {
			precision,
			fraction: 'decimal',
			lowerExp: -20,
			upperExp: 20
		});
		// eslint-disable-next-line @typescript-eslint/no-implicit-any-catch
	} catch (error: any) {
		if (process.env.DEBUG) {
			return error.message;
		}

		return expression;
	}
};

export {
	mathParser,
	Parser
};
