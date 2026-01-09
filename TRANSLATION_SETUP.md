# Google Cloud Translation API Setup Guide

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID (you'll need this for `.env`)

## Step 2: Enable Translation API

1. In the Google Cloud Console, navigate to APIs & Services > Library
2. Search for "Cloud Translation API"
3. Click on it and press "Enable"

## Step 3: Create Service Account

1. Go to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Name it (e.g., "template-translator")
4. Grant role: "Cloud Translation API User"
5. Click "Done"

## Step 4: Generate Credentials

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select JSON format
5. Download the JSON file

## Step 5: Configure Your Application

Add the following to your `.env.local` file:

```bash
# Copy from the .env.example.translation template
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
GOOGLE_APPLICATION_CREDENTIALS=./path/to/your-service-account-key.json
```

**Important Security Note:**
- Never commit the service account JSON file to version control
- Add it to `.gitignore`
- For production, use environment variables or secrets manager

## Cost Estimate

- Translation API: $20 per 1 million characters
- Average template: ~1,000 characters
- 14 languages = 14,000 characters per template
- **Cost per template: ~$0.28** (one-time)

## Testing the Integration

After setup:
1. Create a new HTML template with `data-editable` attributes
2. Check the server logs for "✅ Template auto-translated to 14 languages"
3. Switch language in the UI to see translations

## Troubleshooting

**Error: "Could not load the default credentials"**
- Make sure `GOOGLE_APPLICATION_CREDENTIALS` path is correct
- Try using absolute path instead of relative path

**Error: "Translation API has not been used"**
- Ensure you've enabled the Translation API in Google Cloud Console
- Wait a few minutes after enabling

**No translations generated:**
- Check server logs for error messages
- Verify your service account has "Cloud Translation API User" role
- Make sure your template has `data-editable` attributes or IDs on text elements
