import { app } from '@azure/functions';

app.http('healthz', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'healthz',
  handler: async () => {
    return {
      status: 200,
      jsonBody: {
        ok: true,
        service: 'retentionpulse'
      }
    };
  }
});