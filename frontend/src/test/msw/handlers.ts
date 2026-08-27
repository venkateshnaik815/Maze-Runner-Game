import { http, HttpResponse } from 'msw';

export const handlers = [
  // ── Auth Handlers ────────────────────────────────────────────────
  
  http.post('http://localhost:8080/api/v1/auth/login', async ({ request }) => {
    const body = await request.json() as { usernameOrEmail?: string; password?: string };
    
    if (body.usernameOrEmail === 'invalid') {
      return HttpResponse.json(
        { title: 'Authentication Failed', detail: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      token_type: 'Bearer',
      expires_in: 900,
      user_id: '12345678-1234-1234-1234-123456789012',
      username: 'testplayer',
      email: 'test@mazerunner.com',
      role: 'PLAYER',
      email_verified: true,
    });
  }),

  http.post('http://localhost:8080/api/v1/auth/register', () => {
    return HttpResponse.json(
      {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        token_type: 'Bearer',
        expires_in: 900,
        user_id: '12345678-1234-1234-1234-123456789012',
        username: 'newplayer',
        email: 'new@mazerunner.com',
        role: 'PLAYER',
        email_verified: false,
      },
      { status: 201 }
    );
  }),

  http.post('http://localhost:8080/api/v1/auth/refresh', () => {
    return HttpResponse.json({
      access_token: 'new-mock-access-token',
      refresh_token: 'new-mock-refresh-token',
    });
  }),

  http.post('http://localhost:8080/api/v1/auth/logout', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
