// AI Provider Factory
// Selects the intelligence provider based on configuration.
// Falls back to deterministic rule-based analysis when no external AI is configured.

import { AIIntelligenceConfig, IAIIntelligenceProvider } from '../types/index';
import { deterministicProvider } from './DeterministicProvider';

const DEFAULT_CONFIG: AIIntelligenceConfig = {
  provider: 'deterministic',
};

function readConfigFromEnv(): AIIntelligenceConfig {
  if (typeof process === 'undefined') return DEFAULT_CONFIG;

  const provider = process.env.NEXT_PUBLIC_AI_PROVIDER as AIIntelligenceConfig['provider'] | undefined;
  const apiKey = process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY;
  const endpoint = process.env.AI_API_ENDPOINT;
  const model = process.env.AI_MODEL;

  if (provider && provider !== 'deterministic' && apiKey) {
    return { provider, apiKey, endpoint, model };
  }

  return DEFAULT_CONFIG;
}

export function createAIProvider(config?: Partial<AIIntelligenceConfig>): IAIIntelligenceProvider {
  const resolved = { ...readConfigFromEnv(), ...config };

  switch (resolved.provider) {
    case 'openai':
    case 'anthropic':
    case 'custom':
      // External providers are not configured in this demo project.
      // Return deterministic provider with a clear fallback path for future integration.
      console.info(
        `[AI Intelligence] Provider "${resolved.provider}" requested but not implemented — using deterministic fallback`
      );
      return deterministicProvider;
    case 'deterministic':
    default:
      return deterministicProvider;
  }
}

export function getAIConfig(): AIIntelligenceConfig {
  return readConfigFromEnv();
}
