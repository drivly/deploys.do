export default {
  fetch: async (req, env) => {
    const { origin, pathname } = new URL(req.url)
    const module = await fetch('https://esb.deno.dev/https:/' + pathname).then(res => res.text())
    const id = req.headers.get('cf-ray')
    
    return new Response(JSON.stringify({ success: truel }, null, 2))
  }
}
