# Environment Variables Documentation

## OpenRouter API Keys

The application uses **5 different OpenRouter API keys** for tier-based model access:

```env
# Free tier models
OPENROUTER_API_KEY_FREE=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

# Pro tier models
OPENROUTER_API_KEY_PRO=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

# Ultra tier models
OPENROUTER_API_KEY_ULTRA=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

# Maxx tier models
OPENROUTER_API_KEY_MAXX=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

# BandhanNova 2.0 eXtreme (special research model)
OPENROUTER_API_KEY_EXTREME=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
```

## How It Works

1. **User makes a chat request** with a specific model ID
2. **System checks user's subscription tier** from the database
3. **Validates model access** based on tier
4. **Selects appropriate API key** based on the model's tier requirement
5. **Executes request** with fallback chain if primary model fails

## Model-to-API-Key Mapping

| Model | API Key Used |
|-------|-------------|
| BDN: Ispat V2 Flash | `OPENROUTER_API_KEY_FREE` |
| BDN: Ispat V2 Pro | `OPENROUTER_API_KEY_PRO` |
| BDN: Ispat V2 Ultra | `OPENROUTER_API_KEY_ULTRA` |
| BDN: Ispat V2 Maxx | `OPENROUTER_API_KEY_MAXX` |
| Barud 2 Smart-fls | `OPENROUTER_API_KEY_FREE` |
| Barud 2 Smart-pro | `OPENROUTER_API_KEY_PRO` |
| Barud 2 Smart-ult | `OPENROUTER_API_KEY_ULTRA` |
| Barud 2 Smart-max | `OPENROUTER_API_KEY_MAXX` |
| BandhanNova 2.0 eXtreme | `OPENROUTER_API_KEY_EXTREME` |

## Security Best Practices

⚠️ **IMPORTANT**: Never commit API keys to version control!

- Keep `.env.local` in `.gitignore`
- Rotate keys periodically for security
- Monitor API usage on OpenRouter dashboard
- Use different keys for development and production

## Troubleshooting

If you see errors like "API key not configured for tier: xxx":

1. Check that all 5 API keys are present in `.env.local`
2. Restart the development server after adding keys
3. Verify the keys are valid on OpenRouter dashboard
