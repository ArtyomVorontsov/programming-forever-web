(function(){"use strict";const e=(t,s=[])=>postMessage(t,s);onmessage=async({data:t})=>{try{e({status:"Loading the browser renderer…",progress:2});const s="https://cdn.jsdelivr.net/pyodide/v314.0.7/full/",{loadPyodide:p}=await import(`${s}pyodide.mjs`),o=await p({indexURL:s});await o.loadPackage("micropip");const r=o.pyimport("micropip");e({status:"Loading animation tools…",progress:8}),await r.install("manimgx==0.1.1"),r.destroy();const i=o.runPython(`
from manimgx import _engine
from manimgx.drawing.typesetting import FONTS
(*_engine.web(), _engine.face_fonts(list(FONTS)))
`),[c,a,m]=i.toJs();i.destroy(),e({engine:{js:c,wasm:a,fonts:m}},[a.buffer,...m.map(n=>n.buffer)]),o.globals.set("plan_json",JSON.stringify(t.plan)),o.globals.set("send_frame",n=>e({feed:n.buffer},[n.buffer])),o.globals.set("scene_ready",(n,d)=>e({status:`Animating scene ${n} of ${d}…`,progress:12+Math.round(18*n/d)})),await o.runPythonAsync(`
import json
from pyodide.ffi import to_js
PLAN = json.loads(plan_json)
${t.source}
BrowserFilm().render(take=lambda chunk: send_frame(to_js(chunk)))
`),e({done:!0})}catch(s){e({error:s instanceof Error?s.message:String(s)})}}})();
