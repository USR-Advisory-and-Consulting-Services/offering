(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const status=m=>{const e=$('#status');if(e)e.textContent=m};
const save=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)};
const bytes=b=>(b/1048576).toFixed(2)+' MB';
function setupFiles(){const dz=$('.dropzone'),input=$('input[type=file]');if(!dz||!input)return;dz.onclick=e=>{if(e.target!==input)input.click()};['dragenter','dragover'].forEach(x=>dz.addEventListener(x,e=>{e.preventDefault();dz.classList.add('drag')}));['dragleave','drop'].forEach(x=>dz.addEventListener(x,e=>{e.preventDefault();dz.classList.remove('drag')}));dz.addEventListener('drop',e=>{try{input.files=e.dataTransfer.files;input.dispatchEvent(new Event('change'))}catch(_){status('Please use the file picker if drag-and-drop is unavailable in this browser.')}})}
function apiBase(){const base=String(window.USR_TOOLS_API_BASE||'').trim().replace(/\/$/,'');if(!base)throw Error('USR Tools API is not connected yet. Deploy tools-api on Render, then set the API URL in tools/api-config.js.');return base}
async function api(endpoint,files,fields={}){const fd=new FormData();(Array.isArray(files)?files:[files]).forEach((f,i)=>fd.append(Array.isArray(files)?'files':'file',f,f.name));Object.entries(fields).forEach(([k,v])=>fd.append(k,String(v)));const r=await fetch(apiBase()+'/'+endpoint,{method:'POST',body:fd});if(!r.ok){let msg='Conversion failed';try{const j=await r.json();msg=j.detail||msg}catch(_){}throw Error(msg)}return await r.blob()}
function fileName(type,src){const base=(src?.name||'download').replace(/\.[^.]+$/,'');const map={'jpg-pdf':'jpg-to-pdf.pdf','images-pdf':'images-to-pdf.pdf','merge-pdf':'merged.pdf','compress-pdf':base+'-compressed.pdf','pdf-word':'pdf-to-word.docx','ppt-word':'ppt-to-word.docx','word-pdf':'word-to-pdf.pdf','word-ppt':'word-to-ppt.pptx'};return map[type]||'download'}
function bind(){setupFiles();const type=document.body.dataset.tool,input=$('input[type=file]');if(!type||!input)return;input.addEventListener('change',()=>{const fs=[...input.files];$('#fileNames').textContent=fs.map(f=>f.name+' ('+bytes(f.size)+')').join('\n');const n=$('#fileCount');if(n)n.textContent=`${fs.length} file${fs.length===1?'':'s'} selected`;});const go=$('#run');if(!go)return;go.addEventListener('click',async()=>{const files=[...input.files];try{if(!files.length)throw Error('Please choose at least one file.');go.disabled=true;status('Uploading securely to the conversion engine…');let blob,name;
if(type==='word-pdf'){blob=await api('word-to-pdf',files[0]);name=fileName(type,files[0]);}
else if(type==='pdf-word'){blob=await api('pdf-to-word',files[0]);name=fileName(type,files[0]);}
else if(type==='ppt-word'){blob=await api('ppt-to-word',files[0]);name=fileName(type,files[0]);}
else if(type==='word-ppt'){blob=await api('word-to-ppt',files[0]);name=fileName(type,files[0]);}
else if(type==='merge-pdf'){if(files.length<2)throw Error('Select at least two PDF files.');blob=await api('merge-pdf',files);name='merged.pdf';}
else if(type==='compress-pdf'){blob=await api('compress-pdf',files[0],{compression:$('#compression')?.value||'recommended'});name=fileName(type,files[0]);}
else if(type==='pdf-jpg'||type==='pdf-png'){const dpi=Number($('#quality')?.value||2)*90;blob=await api(type==='pdf-jpg'?'pdf-to-jpg':'pdf-to-png',files[0],{dpi});name=files[0].name.replace(/\.[^.]+$/,'')+(blob.type==='application/zip'?`-${type==='pdf-jpg'?'jpg':'png'}-pages.zip`:`-page-1.${type==='pdf-jpg'?'jpg':'png'}`)}
else if(type==='jpg-pdf'||type==='images-pdf'){blob=await api(type==='jpg-pdf'?'jpg-to-pdf':'images-to-pdf',files,{page_size:($('#pageSize')?.value||'a4').toUpperCase(),orientation:$('#orientation')?.value||'auto',margin:Number($('#margin')?.value||10)});name=fileName(type,files[0]);}
else if(type==='image-compressor'){blob=await api('image-compressor',files,{target_kb:Number($('#target')?.value||200),max_width:Number($('#maxWidth')?.value||2400),fmt:$('#format')?.value||'jpg'});name=blob.type==='application/zip'?'compressed-images.zip':files[0].name.replace(/\.[^.]+$/,'')+'.'+($('#format')?.value||'jpg');}
else if(type==='image-resizer'){blob=await api('image-resizer',files,{width:Number($('#width').value),height:Number($('#height').value),keep:$('#keep')?.checked?'true':'false'});name=blob.type==='application/zip'?'resized-images.zip':files[0].name.replace(/\.[^.]+$/,'-resized.jpg');}
else throw Error('This tool is not configured.');
save(blob,name);status('Done. Your high-quality file is ready to download.');
}catch(e){console.error(e);status('Could not complete the tool. '+(e.message||e)+' If this is a deployment issue, make sure the USR Tools API is running and api-config.js points to it.')}finally{go.disabled=false}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
