import { HTTPErrorTitles, HTTPStatusCodesErrorNumber } from './apiTypes';

export class APIError extends Error {
  #statusCode: HTTPStatusCodesErrorNumber;
  #title: HTTPErrorTitles;
  #detail: string;

  constructor(status: HTTPStatusCodesErrorNumber, title: HTTPErrorTitles, detail: string) {
    super(detail);
    Error.captureStackTrace(this, this.constructor);

    this.#statusCode = status;
    this.#title = title;
    this.#detail = detail;
  }

  title() {
    return this.#title;
  }

  detail() {
    return this.#detail;
  }

  statusCode() {
    return this.#statusCode;
  }

  statusCodeStr() {
    return this.#statusCode.toString();
  }
}

export function isAPIError(error: unknown): error is APIError {
  if (error && typeof error === 'object' && 'statusCode' in error && 'title' in error && 'detail' in error) {
    return true;
  }
  return false;
}
