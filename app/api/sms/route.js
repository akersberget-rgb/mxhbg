export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(JSON.stringify({ status: 'ok', proxy: 'HBG SMS Proxy Ready' }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

export async function POST(req) {
  try {
    const { from, to, message } = await req.json();
    
    if (!process.env.ELKS_USERNAME || !process.env.ELKS_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Missing ELKS_USERNAME or ELKS_PASSWORD' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const credentials = `${process.env.ELKS_USERNAME}:${process.env.ELKS_PASSWORD}`;
    const auth = Buffer.from(credentials).toString('base64');
    
    const r = await fetch('https://api.46elks.com/a1/SMS', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ from, to, message })
    });
    
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    
    return new Response(JSON.stringify(data), {
      status: r.ok ? 200 : r.status,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
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
