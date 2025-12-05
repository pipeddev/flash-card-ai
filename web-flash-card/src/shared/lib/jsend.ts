export type JSendSuccess<T> = {
  status: 'success';
  data: T;
};

export type JSendFail<T = unknown> = {
  status: 'fail';
  data: T;
};

export type JSendError = {
  status: 'error';
  message: string;
  code?: number;
  data?: unknown;
};

export type JSendResponse<T> = JSendSuccess<T> | JSendFail | JSendError;
