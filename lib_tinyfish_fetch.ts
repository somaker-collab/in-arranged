import { tinyfishRequest } from './client';

export async function runTinyFishFetch(url: string, extractRules?: any) {
  return tinyfishRequest('/fetch', {
    method: 'POST',
    body: JSON.stringify({ url, extract_rules: extractRules }),
  });
}