export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(JSON.stringify({ ok: true, msg: 'HBG Proxy Ready - POST from,to,message' }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    let { from, to, message } = body;
    
    // 46elks test-konton kräver att from är ditt verifierade nummer
    // Om du får 403 på HBG MX, testa med +46705347384
    
    const user = process.env.ELKS_USERNAME;
    const pass = process.env.ELKS_PASSWORD;
    
    if (!user || !pass) {
      return new Response(JSON.stringify({ error: 'Saknar ELKS_USERNAME/PASSWORD i Vercel env' }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
    }
    
    const auth = Buffer.from(`${user.trim()}:${pass.trim()}`).toString('base64');
    
    const resp = await fetch('https://api.46elks.com/a1/SMS', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ from, to, message })
    });
    
    const text = await resp.text();
    
    // Returnera exakt vad 46elks säger
    return new Response(text, {
      status: resp.status,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (e) {
    return new Response(JSON.stringify({ proxy_error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
