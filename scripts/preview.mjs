// Local production-export preview. No directory listing, backend or SPA fallback.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const port=Number(process.env.PORT||4176);
if(!Number.isInteger(port)||port<1024||port>65535) throw new Error('PORT must be an integer from 1024 to 65535');
await stat(path.join(root,'index.html'));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.txt':'text/plain; charset=utf-8','.json':'application/json','.xml':'application/xml','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.webp':'image/webp'};
const server=http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const requested=path.resolve(root,'.'+pathname);
  if(requested!==root&&!requested.startsWith(root+path.sep)) throw new Error('Invalid path');
  let target;
  for(const candidate of [requested,requested+'.html',path.join(requested,'index.html')]) {try {if((await stat(candidate)).isFile()){target=candidate;break;}}catch{}}
  const status=target?200:404;target ||= path.join(root,'404.html');
  const body=await readFile(target);res.writeHead(status,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);
 }catch {res.writeHead(400);res.end('Invalid request');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local production export: http://127.0.0.1:${port}`));
