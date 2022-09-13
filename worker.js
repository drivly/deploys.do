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
    
    const body = new FormData
    body.append('metadata', '{ "main_module": "worker.js", "some_binding": "stuff" }')
    body.append('"worker.js"', '@worker.js;type=application/javascript+module')
    body.append('"second-file.js"', '@second-file.js;type=application/javascript+module')

    const result = fetch(`https://api.cloudflare.com/client/v4/accounts/9a7806061c88ada191ed06f989cc3dac/workers/scripts/this-is_my_script-01`, {
      body,
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + env.CF_TOKEN,
      },
      method: "PUT"
    })
    
    return new Response(JSON.stringify({ result }, null, 2))
  }
}
