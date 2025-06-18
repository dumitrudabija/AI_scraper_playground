# 🔐 Anthropic API Key Setup Guide

This guide will help you securely configure your Anthropic API key for the AI News Scraper.

## Step 1: Get Your Anthropic API Key

1. **Visit the Anthropic Console**: Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. **Sign up or log in** to your Anthropic account
3. **Navigate to API Keys**: Look for "API Keys" in the dashboard
4. **Create a new key**: Click "Create Key" or similar button
5. **Copy your API key**: It will look something like `sk-ant-api03-...` (keep this secret!)

## Step 2: Configure Your Environment File

Your `.env` file is already created. You need to replace the placeholder with your actual API key.

### Option A: Edit the file directly
1. Open the `.env` file in your text editor
2. Replace `your_anthropic_api_key_here` with your actual API key
3. Save the file

The file should look like this:
```
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

### Option B: Use the command line (macOS/Linux)
```bash
cd ai-news-scraper
echo "ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here" > .env
```

## Step 3: Verify Your Setup

Test that your API key is working:

```bash
cd ai-news-scraper
python3 -c "
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('ANTHROPIC_API_KEY')
if api_key and api_key != 'your_anthropic_api_key_here':
    print('✅ API key configured successfully!')
    print(f'Key starts with: {api_key[:15]}...')
else:
    print('❌ API key not configured properly')
"
```

## 🔒 Security Best Practices

### ✅ DO:
- Keep your API key in the `.env` file only
- Never share your API key with anyone
- Use different API keys for different projects/environments
- Regularly rotate your API keys
- Set usage limits in the Anthropic console

### ❌ DON'T:
- Never commit `.env` files to version control (Git)
- Don't hardcode API keys in your source code
- Don't share screenshots that show your API key
- Don't store API keys in plain text files outside of `.env`

## 🛡️ Additional Security Measures

1. **Git Protection**: The `.gitignore` file is configured to exclude `.env` files
2. **Environment Variables**: The scraper only reads from environment variables
3. **Local Storage**: Your API key stays on your local machine

## 💰 Cost Management

- **Monitor Usage**: Check your usage in the Anthropic console
- **Set Limits**: Configure spending limits to avoid unexpected charges
- **Understand Pricing**: Review Anthropic's pricing for Claude API usage

## 🧪 Test Your Configuration

Once configured, test the scraper:

```bash
cd ai-news-scraper
python3 news_scraper.py
```

If everything is set up correctly, you should see:
- ✅ Scraping messages from various news sources
- ✅ Summary generation using Claude
- ✅ Report saved to the `reports/` directory

## 🆘 Troubleshooting

### "ANTHROPIC_API_KEY not found"
- Check that your `.env` file exists in the `ai-news-scraper` directory
- Verify the API key is on a line by itself: `ANTHROPIC_API_KEY=your-key`
- Make sure there are no extra spaces or quotes around the key

### "Authentication failed"
- Verify your API key is correct and active
- Check if your API key has expired
- Ensure you have sufficient credits in your Anthropic account

### "Permission denied"
- Make sure the `.env` file has proper read permissions
- Try running the command from the correct directory

## 📞 Support

If you encounter issues:
1. Check the Anthropic documentation: [https://docs.anthropic.com/](https://docs.anthropic.com/)
2. Review the error messages in the console output
3. Check the log file: `ai_news_scraper.log`

---

**Remember**: Your API key is like a password - keep it secure! 🔐
