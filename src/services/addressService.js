import * as securedRestClient from '../utils/securedRestClient';
import * as storage from '../utils/globalStorage';
import * as validator from '../utils/validator';

export async function create(values) {
  try {
    const userId = await storage.getCurrentCustomerId();
    await securedRestClient.post(`/users/${userId}/addresses`, {
      body: {
        ...values,
        phone: validator.removeSpace(values.phone),
      },
      isJson: true,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function update(values) {
  try {
    const userId = await storage.getCurrentCustomerId();
    await securedRestClient.put(`/users/${userId}/addresses/${values.code}`, {
      body: {
        ...values,
        phone: validator.removeSpace(values.phone),
      },
      isJson: true,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function remove(addressId) {
  try {
    const userId = await storage.getCurrentCustomerId();
    await securedRestClient.remove(`/users/${userId}/addresses/${addressId}`);

    return true;
  } catch (err) {
    return false;
  }
}

export async function getAll() {
  try {
    const userId = await storage.getCurrentCustomerId();
    return await securedRestClient.get(`/users/${userId}/addresses`);
  } catch (err) {
    return {};
  }
}

export async function get(addressId) {
  try {
    const userId = await storage.getCurrentCustomerId();
    return await securedRestClient.get(`/users/${userId}/addresses/${addressId}`);
  } catch (err) {
    return {};
  }
}

export async function select(addressId) {
  try {
    const userId = await storage.getCurrentCustomerId();
    const cartId = await storage.getCurrentCartId();
    const channel = await storage.getCurrentChannel();
    const region = await storage.getCurrentRegionId();
    await securedRestClient.put(`/users/${userId}/carts/${cartId}/addresses/delivery`, {
      params: {
        addressId,
        region,
        channel,
      },
    });

    return true;
  } catch (err) {
    return false;
  }
}
