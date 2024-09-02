import axios from "axios";

const clientId = import.meta.env.VITE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI
const authEndpoint = import.meta.env.VITE_AUTH_ENDPOINT
const tokenEndpoint = import.meta.env.VITE_TOKEN_ENDPOINT
const scopes = import.meta.env.VITE_SCOPES

export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function redirectToSpotifyLogin(): Promise<void> {
  const codeVerifier = generateRandomString(128);
  localStorage.setItem('code_verifier', codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(16);

  const url = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&code_challenge_method=S256&code_challenge=${codeChallenge}&state=${state}&scope=${scopes}`;

  window.location.href = url;
}


export async function exchangeCodeForToken(code: string): Promise<string | null> {
  console.log('exchange called');
  const codeVerifier = localStorage.getItem('code_verifier');

  if (!codeVerifier) return null;

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  try {
    const response = await axios.post(tokenEndpoint, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('spotify_access_token', access_token);
    localStorage.setItem('spotify_refresh_token', refresh_token);
    localStorage.removeItem('code_verifier');
    return access_token;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
}

export async function getNewToken(): Promise<string | null> {
  console.log('Getting new token with refresh token');
  const refreshToken = localStorage.getItem('spotify_refresh_token');

  if (!refreshToken) {
    console.error('No refresh token found');
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  try {
    const response = await axios.post(tokenEndpoint, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('spotify_access_token', access_token);
    
    // Update the refresh token if a new one is provided
    if (refresh_token) {
      localStorage.setItem('spotify_refresh_token', refresh_token);
    }
    
    return access_token;
  } catch (error) {
    console.error('Error getting new token:', error);
    return null;
  }
}
