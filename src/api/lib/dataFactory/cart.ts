import { expect } from '@fixtures/baseAPIFixture';
import { request } from '@playwright/test';
import CartApi from 'src/api/cart/cartApi';
import { extractField } from '../helpers/responseHelpers';
import { AddProductToCart } from '@api/cart/types';
import { Headers } from '@api/baseAPI';

export async function createCart(headers: Headers) {
	let cartId: string;
	const cartApi = new CartApi(await request.newContext(), headers);

	await expect(async () => {
		const response = await cartApi.createCart();
		expect(response).toHaveCreatedStatus();

		cartId = await extractField('id', response);
	}).toPass({
		intervals: [1_000, 2_000, 5_000],
		timeout: 10_000,
	});

	return cartId;
}

export async function addProductToCart(
	data: AddProductToCart,
	headers: Headers
) {
	await expect(async () => {
		const cartId = await createCart(headers);
		const cartApi = new CartApi(await request.newContext(), headers);
		const resp = await cartApi.addProductToCart(cartId, data);
		expect(resp).toHaveOKStatus();
	}).toPass({
		intervals: [1_000, 2_000, 5_000],
		timeout: 10_000,
	});
}
