export default {
  fetch: async (req, env) => {
    const { origin, pathname } = new URL(req.url)
    const module = await fetch('https://esb.deno.dev/https:/' + pathname).then(res => res.text())
    const id = req.headers.get('cf-ray')
    const metadata = JSON.stringify({
      body_part: "script",
      bindings: [],
      tags: ['customer-123', 'staging', 'free-user']
    })
    return new Response(JSON.stringify({ success: truel }, null, 2))
  }
}
