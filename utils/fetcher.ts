import {createUnit, unit} from 'mathjs';
import fetch from 'isomorphic-unfetch';

export const fetchAndImportCurrencies = async (): Promise<void> => {
	const res = await fetch('https://api.exchangeratesapi.io/latest');
	const data = await res.json();

	createUnit(data.base);
	Object.keys(data.rates)
		.filter(currency => {
			return currency !== data.base;
		})
		.forEach(currency => {
			// @ts-ignore
			createUnit(currency, unit(1 / data.rates[currency], data.base));
		});
};

