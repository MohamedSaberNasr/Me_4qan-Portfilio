const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) {
  return resolve.call(this, name.startsWith('@/') ? path.join(__dirname, '..', name.slice(2)) : name, ...args);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
}).outputText, filename);
const { POST } = require('../app/api/inquiry/route.ts');
const { sendInquiry } = require('../lib/send-inquiry.ts');
const data = { name: 'Test Visitor', email: 'visitor@example.com', company: '', service: 'SaaS explainer', budget: 'Under $1,000', timeline: 'Flexible', details: 'A product explanation with animated interface scenes.', website: '', requestId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' };
let ip = 0;
function request(body = data, origin = 'http://localhost:3000') {
  return new Request('http://localhost:3000/api/inquiry', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'x-forwarded-for': `test-${++ip}` }, body: JSON.stringify(body) });
}
test('rejects cross-origin, malformed fields and honeypot without sending', async () => {
  assert.equal((await POST(request(data, 'https://other.example'))).status, 403);
  assert.equal((await POST(request({ ...data, email: 'invalid' }))).status, 400);
  assert.equal((await POST(request({ ...data, service: 'injected' }))).status, 400);
  assert.equal((await POST(request({ ...data, website: 'spam.example' }))).status, 400);
});
test('missing server configuration fails instead of pretending to send', async () => {
  const key = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  const response = await POST(request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).success, undefined);
  if (key !== undefined) process.env.RESEND_API_KEY = key;
});
test('only provider acceptance produces success, recipient is fixed, reply-to is visitor', async () => {
  const original = global.fetch, key = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = 'test-key-no-real-email';
  try {
    let sent;
    global.fetch = async (_url, init) => { sent = JSON.parse(init.body); return new Response(JSON.stringify({ id: 'accepted-test-id' }), { status: 200 }); };
    const response = await POST(request({ ...data, to: 'attacker@example.com' }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).success, true);
    assert.deepEqual(sent.to, ['mohsabmdr@gmail.com']);
    assert.equal(sent.reply_to, data.email);
    assert.ok(sent.text.includes(data.details));
    global.fetch = async () => new Response(JSON.stringify({ message: 'Invalid key' }), { status: 401 });
    assert.equal((await POST(request())).status, 502);
    global.fetch = async () => new Response('{}', { status: 200 });
    assert.equal((await POST(request())).status, 502);
  } finally { global.fetch = original; if (key === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = key; }
});
test('identical retries reuse provider idempotency key; edited content changes it', async () => {
  const keys = [];
  const fetcher = async (_url, init) => { keys.push(init.headers['Idempotency-Key']); return new Response('{"id":"test"}'); };
  await sendInquiry(data, 'dummy', 'sender@example.com', 'owner@example.com', fetcher);
  await sendInquiry(data, 'dummy', 'sender@example.com', 'owner@example.com', fetcher);
  await sendInquiry({ ...data, details: data.details + ' Edited.' }, 'dummy', 'sender@example.com', 'owner@example.com', fetcher);
  assert.equal(keys[0], keys[1]);
  assert.notEqual(keys[0], keys[2]);
});
