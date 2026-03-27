import { z } from 'zod';

const configSchema = z.object({
  KANEO_BASE_URL: z.string().url().optional(),
  KANEO_TOKEN: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;

export function getConfig(): Config {
  const result = configSchema.safeParse(process.env);
  
  if (!result.success) {
    throw new Error(`Invalid config: ${result.error.errors.map(e => e.message).join(', ')}`);
  }
  
  return result.data;
}

export function requireConfig(): { baseUrl: string; token: string } {
  const config = getConfig();
  
  if (!config.KANEO_BASE_URL) {
    throw new Error('KANEO_BASE_URL is required');
  }
  
  if (!config.KANEO_TOKEN) {
    throw new Error('KANEO_TOKEN is required');
  }
  
  let baseUrl = config.KANEO_BASE_URL;
  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl}/api`;
  }
  
  return {
    baseUrl,
    token: config.KANEO_TOKEN,
  };
}
