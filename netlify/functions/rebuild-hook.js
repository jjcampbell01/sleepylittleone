// Netlify function to handle rebuild webhooks from Supabase
exports.handler = async (event, context) => {
  // Verify the request is from Supabase (optional but recommended)
  const supabaseSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  const incomingSecret = event.headers['x-webhook-secret'];
  
  if (supabaseSecret && incomingSecret !== supabaseSecret) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  // Only rebuild for blog post changes
  const body = JSON.parse(event.body || '{}');
  const table = body?.table;
  const eventType = body?.type;

  if (!['blog_posts', 'blog_categories', 'blog_tags'].includes(table)) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Ignored - not a blog content change' })
    };
  }

  try {
    // Trigger a new build
    const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
    
    if (!buildHookUrl) {
      throw new Error('NETLIFY_BUILD_HOOK_URL not configured');
    }

    const response = await fetch(buildHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trigger_title: `Blog content update: ${table} ${eventType}`,
        trigger_metadata: {
          table,
          eventType,
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Build trigger failed: ${response.statusText}`);
    }

    console.log(`Build triggered for ${table} ${eventType}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Build triggered successfully',
        table,
        eventType
      })
    };

  } catch (error) {
    console.error('Webhook error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to trigger build',
        details: error.message 
      })
    };
  }
};