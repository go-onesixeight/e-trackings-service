export interface IThailandReponse {
  response?: Response;
  message?: string;
  status?: boolean;
}

export interface Response {
  items?: Items;
  track_count?: TrackCount;
}

export interface Items {
  EJ666485133TH?: Ej666485133Th[];
}

export interface Ej666485133Th {
  barcode: string;
  status: string;
  status_description: string;
  status_date: string;
  location: string;
  postcode: string;
  delivery_status?: string;
  delivery_description?: string;
  delivery_datetime?: string;
  receiver_name?: string;
  signature?: string;
}

export interface TrackCount {
  track_date: string;
  count_number: number;
  track_count_limit: number;
}

export type IThailandReponseItems = ThailandReponseItems[];

export interface ThailandReponseItems {
  barcode: string;
  status: string;
  status_description: string;
  status_date: string;
  location: string;
  postcode: string;
  delivery_status?: string;
  delivery_description?: string;
  delivery_datetime?: string;
  receiver_name?: string;
  signature?: string;
}
