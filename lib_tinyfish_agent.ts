import { tinyfishRequest } from './client';

export async function runTinyFishAgent(prompt: string, startUrl: string) {
  return tinyfishRequest('/agent', {
    method: 'POST',
    body: JSON.stringify({ prompt, start_url: startUrl, response_format: 'json' }),
  });
}