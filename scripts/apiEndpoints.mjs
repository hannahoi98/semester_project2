/**
 * Base REST API root
 * @type {string}
 */
export const BASE_API_URL = "https://v2.api.noroff.dev/";

/**
 * Auth endpoint: register a new user.
 * @type {string}
 */
export const AUTH_REGISTER_URL = `${BASE_API_URL}auth/register`;

/**
 * Auth endpoint: login user.
 * @type {string}
 */
export const AUTH_LOGIN_URL = `${BASE_API_URL}auth/login`;

/**
 * Profile endpoint for a specific user.
 * @type {string}
 */
export const AUTH_PROFILE_URL = `${BASE_API_URL}auction/profiles/<name>`;

/**
 * Listings endpoint
 * @type {string}
 */
export const GET_LISTINGS_URL = `${BASE_API_URL}auction/listings`;

/**
 * API key for authenticated requests (Noroff v2).
 * @type {string}
 */
export const API_KEY = "7fdd7132-4334-46f7-89ec-0c1e82d304fa";