export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
