export type ApiResponseError = {
  type: string;
  message: string;
  error?: any;
}

export type ApiResponse<T, E = ApiResponseError> = {
  data: T | null;
  error: E | null;
};
