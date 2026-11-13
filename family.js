(()=>{"use strict";
const C=window.CULEBRITA_CONFIG||{},$=id=>document.getElementById(id);
const ON=!!(C.supabaseUrl&&C.anonKey&&window.supabase);
if(!ON){['bK','bU'].forEach(i=>{const e=$(i);if(e)e.style.display='none'});window.Family={gameOver(){}};return}
const LS={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uuid=()=>crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:r&3|8).toString(16)});
const net=e=>!e||e.status===0||/fetch|network|load failed/i.test(e.message||'');
const sb=window.supabase.createClient(C.supabaseUrl,C.anonKey,{auth:{persistSession:true,autoRefreshToken:true}});
let me=null,rows=LS.get('cul_rank',[]),view='',flushing=false,err='',ch=null;
const css=document.createElement('style');css.textContent=`
#fam{position:fixed;inset:0;z-index:30;display:none;align-items:center;justify-content:center;padding:12px;background:rgba(5,6,24,.88);overflow:auto;color:#dfe6ff;font-family:"Trebuchet MS",Verdana,sans-serif}
#fam.on{display:flex}
.fb{width:100%;max-width:440px;max-height:94vh;overflow:auto;background:linear-gradient(160deg,#2b3a67,#1a2344);border:1px solid rgba(255,255,255,.25);border-radius:24px;padding:16px;text-align:center;box-shadow:0 0 50px rgba(120,60,255,.5)}
.fb h2{margin:0 0 10px;color:#9be628;letter-spacing:2px;font-size:20px}
.pl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;max-height:min(55vh,460px);overflow-y:auto;overscroll-behavior:contain;padding:2px;align-content:start}
.pc{border:2px solid var(--c);border-radius:16px;background:rgba(0,0,0,.25);color:#fff;padding:12px 4px;display:flex;flex-direction:column;align-items:center;gap:4px;font-family:inherit;font-size:14px}
.pc i{font-style:normal;font-size:34px}
.go2,.ln2{width:100%;margin-top:8px;padding:12px;border:0;border-radius:999px;font-family:inherit;font-weight:bold;font-size:15px}
.go2{background:linear-gradient(#46f09a,#0aa05a);color:#052;box-shadow:0 4px 0 #06683a}
.ln2{background:rgba(255,255,255,.12);color:#dfe6ff;font-size:12px;padding:9px}
.go2:disabled{opacity:.5}
.fb input{width:100%;padding:12px;border-radius:12px;border:2px solid #46508a;background:#0c0f1f;color:#fff;font-size:18px;text-align:center}
.er{color:#ff8a8a;min-height:20px;margin-top:6px;font-size:13px}
.big{font:bold 64px monospace;color:#9be628}
.rec{font-weight:bold;color:#ffd23f;font-size:20px;margin:6px 0;animation:pop .6s infinite alternate}
@keyframes pop{to{transform:scale(1.15);text-shadow:0 0 16px #ffd23f}}
.pod{display:flex;align-items:flex-end;justify-content:center;gap:8px;margin:6px 0 10px}
.col{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:12px;min-width:0}
.col b{max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.col .sc{font:bold 18px monospace;color:#ffd23f}
.bar{width:100%;border-radius:8px 8px 0 0;transform-origin:bottom;animation:gr .7s ease-out both;display:flex;justify-content:center}
.p1 .bar{height:90px;background:linear-gradient(#ffd23f,#e69a00)}.p2 .bar{height:62px;background:linear-gradient(#d0d6e8,#8d96b5)}.p3 .bar{height:42px;background:linear-gradient(#e0a070,#a66a3c)}
.bar em{font:bold 20px monospace;color:#1a1000;padding-top:4px}
@keyframes gr{from{transform:scaleY(0)}}
.tr{font-size:40px;animation:bn 1s ease-in-out infinite alternate}@keyframes bn{to{transform:translateY(-8px) rotate(8deg)}}
.av{width:38px;height:38px;border-radius:50%;background:var(--c);display:inline-flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 10px var(--c);flex:none}
.rw{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:12px;background:rgba(255,255,255,.07);margin-top:6px;text-align:left}
.rw b{flex:1;overflow:hidden;text-overflow:ellipsis}.rw span{font:bold 16px monospace;color:#ffd23f;text-align:right}
.rw small{display:block;font:10px sans-serif;color:#9aa6d8}.rw em{font:bold 14px monospace;width:18px}
.me{outline:2px solid #3ff0ff}.st{margin:10px 0 2px;font-size:12px;color:#9cf}.two{display:flex;gap:6px}
.cf{position:fixed;top:-30px;z-index:40;pointer-events:none;font-size:24px;animation:fall 2.4s ease-in forwards}
@keyframes fall{to{transform:translateY(112vh) rotate(500deg);opacity:.3}}`;
document.head.appendChild(css);
const ov=document.createElement('div');ov.id='fam';document.body.appendChild(ov);
const open=h=>{ov.innerHTML='<div class="fb">'+h+'</div>';ov.classList.add('on')};
const close=()=>{ov.classList.remove('on');view=''};
const queue=()=>LS.get('cul_q',[]).filter(x=>me&&x.uid===me.id);
const status=()=>{const n=queue().length,p=n?` · ${n} pendiente${n>1?'s':''}`:'';return !navigator.onLine?'📴 Sin conexión'+p:n?'⏳ Sincronización pendiente'+p+(err?' · '+esc(err):''):'☁ Sincronizado'};
const pauseGame=()=>{try{if(st==='running')pause()}catch(e){}};
const fd=d=>d?new Date(d).toLocaleDateString('es',{day:'numeric',month:'short',year:'numeric'}):'—';
const av=p=>`<span class="av" style="--c:${esc(p.color)}">${esc(p.avatar)}</span>`;
function rain(){const e=['🏆','⭐','🍓','✨'];for(let i=0;i<40;i++){const d=document.createElement('div');d.className='cf';d.textContent=e[i%4];d.style.left=Math.random()*100+'vw';d.style.animationDelay=Math.random()*.8+'s';document.body.appendChild(d);setTimeout(()=>d.remove(),3400)}}
/* ---- sesión ---- */
async function showLogin(){view='login';pauseGame();
 let pp=LS.get('cul_pp',[]);try{const{data}=await sb.rpc('public_profiles');if(data&&data.length){pp=data;LS.set('cul_pp',pp)}}catch(e){}
 if(!pp.length)pp=[1,2,3,4].map(s=>({slot:s,display_name:'Jugador '+s,avatar:'🐍',color:'#46f09a'}));
 open('<h2>¿QUIÉN JUEGA?</h2><div class="pl">'+pp.map(p=>`<button class="pc" data-s="${p.slot}" style="--c:${esc(p.color)}"><i>${esc(p.avatar)}</i><b>${esc(p.display_name)}</b></button>`).join('')+'</div><button class="ln2" id="fG">Jugar sin ranking</button>');
 ov.querySelectorAll('.pc').forEach(b=>b.onclick=()=>askPass(+b.dataset.s,pp.find(p=>p.slot==b.dataset.s)));$('fG').onclick=close}
// Los cuatro correos existentes tienen prioridad. Para nuevos integrantes se usa
// un patrón configurable, por lo que basta con crear sus cuentas/perfiles en Supabase.
// El correo es solamente el identificador de acceso; la contraseña nunca se almacena aquí.
function emailForSlot(slot){
 if(!Number.isSafeInteger(slot)||slot<1||slot>1000)return null;
 const existing=(C.players||[]).find(x=>Number(x.slot)===slot);
 if(existing&&existing.email)return existing.email;
 const pattern=C.playerEmailPattern||'';
 return /^jugador\{slot\}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(pattern)
  ?pattern.replace('{slot}',String(slot)):null;
}
function askPass(slot,p){const email=emailForSlot(slot);
 open(`<h2>${esc(p.avatar)} ${esc(p.display_name)}</h2><input id="fPw" type="password" placeholder="Tu clave" autocomplete="current-password"><div id="fEr" class="er"></div><button id="fGo" class="go2">ENTRAR</button><button id="fBk" class="ln2">Volver</button>`);
 const go=async()=>{if(!email){$('fEr').textContent='No está configurado el acceso de este jugador';return}
  $('fGo').disabled=true;const{error}=await sb.auth.signInWithPassword({email,password:$('fPw').value}).catch(e=>({error:e}));
  if(error){$('fGo').disabled=false;$('fEr').textContent=net(error)?'Sin conexión. Reintenta con Internet.':'Clave incorrecta';return}
  await onLogin();close()};
 $('fGo').onclick=go;$('fPw').onkeydown=e=>{if(e.key==='Enter')go()};$('fBk').onclick=showLogin;$('fPw').focus()}
async function onLogin(){const{data}=await sb.auth.getSession();me=data.session?{id:data.session.user.id}:null;if(me){sub();loadRank();flush()}}
function sub(){if(ch)return;try{ch=sb.channel('rank').on('postgres_changes',{event:'*',schema:'public',table:'profiles'},()=>loadRank()).subscribe()}catch(e){}}
/* ---- ranking ---- */
async function loadRank(){try{const{data,error}=await sb.from('profiles').select('id,slot,display_name,avatar,color,best_score,games_played,total_points,best_at').order('best_score',{ascending:false}).order('best_at',{ascending:true,nullsFirst:false});if(error)throw error;rows=data;LS.set('cul_rank',rows);if(err==='error')err=''}catch(e){if(!net(e))err='error'}
 if(view==='rank')renderRank()}
function renderRank(){view='rank';const r=rows,pod=[[r[1],2],[r[0],1],[r[2],3]].filter(x=>x[0]);
 open(`<h2>🏆 RANKING FAMILIAR</h2>`+(r.length?`<div class="pod">${pod.map(([p,pos])=>`<div class="col p${pos}${me&&p.id===me.id?' me':''}">${pos===1?'<div class="tr">🏆</div>':''}${av(p)}<b>${esc(p.display_name)}</b><span class="sc">${p.best_score||'—'}</span><div class="bar"><em>${pos}</em></div></div>`).join('')}</div>`+r.map((p,i)=>`<div class="rw${me&&p.id===me.id?' me':''}"><em>${i+1}</em>${av(p)}<b>${esc(p.display_name)}${i===0&&p.best_score?' 👑':''}</b><span>${p.best_score||'—'}<small>${fd(p.best_at)} · ${p.games_played} part. · ${p.total_points} pts</small></span></div>`).join(''):'<p>Sin datos todavía. ¿Estás sin conexión?</p>')
 +`<div class="st">${status()}</div><button id="fX" class="go2">CERRAR</button><div class="two"><button id="fN" class="ln2">Cambiar mi nombre</button><button id="fO" class="ln2">Cambiar jugador</button></div>`);
 $('fX').onclick=close;$('fN').onclick=rename;$('fO').onclick=async()=>{try{await sb.auth.signOut()}catch(e){}me=null;showLogin()}}
async function rename(){if(!me)return;const n=prompt('Tu nombre (máx. 20 letras):');if(!n)return;try{const{error}=await sb.rpc('update_profile',{p_name:n});if(error)throw error;await loadRank()}catch(e){alert(net(e)?'Sin conexión':'Nombre no válido')}}
/* ---- cola de envío (idempotente por id de partida) ---- */
async function flush(){if(!me||flushing||!navigator.onLine)return;flushing=true;let did=false;
 try{for(const it of queue()){const{error}=await sb.rpc('submit_score',{p_id:it.id,p_score:it.score,p_steps:it.steps,p_ms:it.ms,p_played_at:it.at});
  if(error&&net(error))break;err=error?'una partida fue rechazada':'';
  LS.set('cul_q',LS.get('cul_q',[]).filter(x=>x.id!==it.id));did=true}}catch(e){}
 flushing=false;if(did)await loadRank();const s=$('fSt');if(s)s.textContent=status()}
function gameOver(r){
 if(me)LS.set('cul_q',LS.get('cul_q',[]).concat({id:uuid(),uid:me.id,score:r.score,steps:r.steps,ms:r.ms,at:new Date().toISOString()}));
 setTimeout(()=>{if(st!=='over')return;
  if(!me){open(`<h2>FIN DE PARTIDA</h2><div class="big">${r.score}</div><p>Elige tu jugador para guardar puntos en el ranking.</p><button id="fL" class="go2">ELEGIR JUGADOR</button><button id="fC" class="ln2">Cerrar</button>`);$('fL').onclick=showLogin;$('fC').onclick=close;return}
  const m=rows.find(x=>x.id===me.id),rec=r.score>0&&r.score>((m&&m.best_score)||0);view='res';
  open(`<h2>FIN DE PARTIDA</h2><div class="big">${r.score}</div><div>Nivel ${r.level}</div>${rec?'<div class="rec">🏆 ¡NUEVO RÉCORD!</div>':''}<div class="st" id="fSt">${status()}</div><button id="fP" class="go2">JUGAR OTRA VEZ</button><button id="fR" class="ln2">🏆 Ver ranking</button>`);
  if(rec)rain();$('fP').onclick=()=>{close();try{begin()}catch(e){}};$('fR').onclick=()=>{renderRank();loadRank()}},700);
 flush()}
$('bK').onclick=()=>{pauseGame();if(!me)showLogin();else{renderRank();loadRank()}};
$('bU').onclick=()=>{pauseGame();showLogin()};
addEventListener('online',()=>{flush();loadRank()});addEventListener('offline',()=>{if(view==='rank')renderRank()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){flush();loadRank()}});
setInterval(()=>{flush();if(view==='rank')loadRank()},45000);
sb.auth.onAuthStateChange((ev,s)=>{me=s?{id:s.user.id}:null});
(async()=>{try{const{data}=await sb.auth.getSession();if(data.session){me={id:data.session.user.id};sub();loadRank();flush()}else showLogin()}catch(e){showLogin()}})();
window.Family={gameOver};
})();
