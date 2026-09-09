export async function POST(req) {
  const { from, to, message } = await req.json();
  const auth = Buffer.from(
    process.env.ELKS_USERNAME + ':' + process.env.ELKS_PASSWORD
  ).toString('base64');
  const r = await fetch('https://api.46elks.com/a1/SMS', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ from, to, message })
  });
  const data = await r.json();
  return new Response(JSON.stringify(data), {
    status: r.ok ? 200 : r.status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
