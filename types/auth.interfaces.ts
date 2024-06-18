interface TokenResponse {
  access_token: string | null;
  expires_in: number | null;
  token_type: string | null;
}

interface TokenObject {
  access_token: string;
  expiration_date: Date;
  token_type: string;
}
