export interface User {
  id: string;
  name: string;
  uni_email: string;
  rating: number;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
}

export interface Listing {
  id: string;
  title: string;
  edition: string;
  unit_code: string;
  price_cents: number;
  condition: string;
  status: string;
  seller: Seller;
}
