export type ApiResponse<T> = {
  status_code: number;
  time: Date;
  message: string[];
  url: string;
  data: T;
};
