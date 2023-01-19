// Type format represents this spec https://jsonapi.org/format/#errors

export type HTTPRequestMethods = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type HTTPStatusCodesSuccess = '200' | '201' | '202' | '204';
export type HTTPStatusCodesSuccessNumber = 200 | 201 | 202 | 204;
export type HTTPStatusCodesError = '400' | '401' | '403' | '404' | '405' | '500' | '502' | '503';
export type HTTPStatusCodesErrorNumber = 400 | 401 | 403 | 404 | 405 | 500 | 502 | 503;

export type HTTPStatusCodes = HTTPStatusCodesError | HTTPStatusCodesSuccess;
export type HTTPStatusCodesNumber = HTTPStatusCodesErrorNumber | HTTPStatusCodesSuccessNumber;

export type HTTPErrorTitles =
  | 'NOT FOUND'
  | 'METHOD NOT ALLOWED'
  | 'MISSING QUERY PARAMETER'
  | 'INVALID QUERY PARAMETER'
  | 'MISSING BODY PARAMETER'
  | 'INVALID BODY PARAMETER'
  | 'POST REQUEST UNSUCESSFUL'
  | 'PUT REQUEST UNSUCESSFUL'
  | 'PATCH REQUEST UNSUCESSFUL'
  | 'DELETE REQUEST UNSUCESSFUL'
  | 'INVALID URL'
  | 'UNHANDLED ERROR'
  | 'SERVER ERROR'
  | 'API IN CONSTRUCTION'
  | 'ACCESS_DENIED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN';

export interface tAPIError {
  status: HTTPStatusCodesError;
  title: HTTPErrorTitles;
  detail: string;
  // code?: string; // Application specific error code.
}

export interface tAPIResponseError {
  error: tAPIError; // Choosing to use error and not errors for easier writing. Can extend in the future if needed
}

export interface tAPIResponseSuccess<Type = any> {
  data: Type;
}

export type tAPIResponse<Type = any> = tAPIResponseError | tAPIResponseSuccess<Type>;

export type tAPIRequest<Type = any> = {
  data: Type;
};
