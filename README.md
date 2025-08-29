# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/dd2a0f5a-9b60-446b-987c-edd10038054e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/dd2a0f5a-9b60-446b-987c-edd10038054e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/dd2a0f5a-9b60-446b-987c-edd10038054e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Environment Variables

Create a `.env` file in the project root and include the following keys:

- `ELEVENLABS_API_KEY`
- `OPENROUTER_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_ENVIRONMENT`
- `PINECONE_INDEX`

## Data Ingestion

After setting the environment variables, populate the Pinecone index by running the ingestion script:

```bash
npm run ingest
# or
node scripts/ingest.mjs
```

## Deploying the Netlify Function

The webhook handler lives at `netlify/functions/rebuild-hook.js`.
To deploy it:

1. Install the Netlify CLI: `npm install -g netlify-cli`.
2. Authenticate with Netlify: `netlify login`.
3. Run `netlify deploy` (or `netlify dev` to test locally).

The function will be bundled and available at `/.netlify/functions/rebuild-hook` after deployment.
