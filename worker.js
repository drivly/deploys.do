export default {
  fetch: async (req, env) => {
    const { origin, hostname, pathname } = new URL(req.url)
    const module = await fetch('https://esb.deno.dev/https:/' + pathname).then(res => res.text())
    const namespace = hostname
    const id = req.headers.get('cf-ray')
    const ip = req.headers.get('cf-connecting-ip')
    
    const metadata = JSON.stringify({
      body_part: "script",
      bindings: [],
      tags: ['customer-123', 'staging', 'free-user']
    })
    
    const body = new FormData
    body.append('metadata', '{ "main_module": "worker.js", "tags": ["stuff"] }')
    body.append('"worker.js"', '@worker.js;type=application/javascript+module')
    body.append('"second-file.js"', '@second-file.js;type=application/javascript+module')

    const result = fetch(`https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/workers/dispatch/namespaces/${namespace}/scripts/${id}`, {
      body,
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + env.CF_TOKEN,
      },
      method: "PUT"
    })
    
//     fetch("https://dash.cloudflare.com/api/v4/accounts/b6641681fe423910342b9ffa1364c76d/workers/services/hello-cloud/environments/production?include_subdomain_availability=true", {
//       "headers": {
//         "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryo7sitaVMTZYACFS2",
//       },
//       "body": "------WebKitFormBoundaryo7sitaVMTZYACFS2\r\nContent-Disposition: form-data; name=\"worker.js\"; filename=\"worker.js\"\r\nContent-Type: application/javascript+module\r\n\r\nexport default {\n  fetch: req => new Response(JSON.stringify(req.cf, undefined, 2))\n}\r\n------WebKitFormBoundaryo7sitaVMTZYACFS2\r\nContent-Disposition: form-data; name=\"metadata\"; filename=\"blob\"\r\nContent-Type: application/json\r\n\r\n{\"bindings\":[],\"main_module\":\"worker.js\"}\r\n------WebKitFormBoundaryo7sitaVMTZYACFS2--\r\n",
//       "method": "PUT",
//     });
    
    return new Response(JSON.stringify({ result }, null, 2))
  }
}
