import {parser} from 'mathjs';

import {fetchAndImportCurrencies} from '../utils/fetcher';

interface Options {
	enableCurrencyConversion?: boolean;
}

const mathParser = parser();

export default (options: Options = {}) => async (expression: string): Promise<string | number> => {
	try {
		if (options.enableCurrencyConversion) {
			await fetchAndImportCurrencies();
		}

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
