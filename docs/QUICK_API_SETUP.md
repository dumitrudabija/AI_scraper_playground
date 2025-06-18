# 🚀 Quick API Key Setup

Since you're already using Claude (me!), you likely have an Anthropic account. Here's how to get your API key:

## Option 1: Get Your API Key from Anthropic Console

1. **Visit**: https://console.anthropic.com/
2. **Login** with the same account you use for Claude
3. **Go to API Keys** section
4. **Create a new key** or copy an existing one
5. **Copy the key** (it starts with `sk-ant-api03-...`)

## Option 2: Check Your Existing Setup

If you're using Claude through another application, check:

### VS Code Extensions
- Look for Claude/Anthropic extensions in VS Code
- Check their settings for API key configuration

### Other AI Tools
- Check if you have other AI tools configured (Cursor, Continue, etc.)
- They might have your API key stored

## Option 3: Create a New API Key

If you don't have one yet:

1. Go to https://console.anthropic.com/
2. Sign up with the same email you use for Claude
3. Navigate to "API Keys"
4. Click "Create Key"
5. Give it a name like "AI News Scraper"
6. Copy the generated key

## Configure Your Key

Once you have your API key, run this command:

```bash
cd ai-news-scraper
echo "ANTHROPIC_API_KEY=your-actual-key-here" > .env
```

Replace `your-actual-key-here` with your real API key.

## Test Your Setup

```bash
cd ai-news-scraper
python3 -c "
import os
from dotenv import load_dotenv
import anthropic

load_dotenv()
api_key = os.getenv('ANTHROPIC_API_KEY')

if not api_key or api_key == 'your_anthropic_api_key_here':
    print('❌ API key not configured')
    exit(1)

try:
    client = anthropic.Anthropic(api_key=api_key)
    print('✅ API key is valid and working!')
    print(f'Key starts with: {api_key[:15]}...')
except Exception as e:
    print(f'❌ API key error: {e}')
"
```

## Need Help?

If you're having trouble finding your API key:
1. Check your email for Anthropic account confirmations
2. Look in your browser's saved passwords for console.anthropic.com
3. Check if you have any AI development tools installed that might have the key

Remember: Your API key is like a password - keep it secure! 🔐
