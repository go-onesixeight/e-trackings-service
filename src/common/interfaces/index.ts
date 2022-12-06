export interface IResponse {
  result: boolean;
  statusCode: number;
  statusMessage: string;
  data?: any;
}

export interface IThrowError {
  statusCode: number;
  statusMessage?: string;
  code?: string;
  error?: Array<any>;
}


export interface IFromResponses<T> {
  result: boolean;
  statusCode: number;
  statusMessage: string;
  data?: T;
  [key: string]: any;
}
