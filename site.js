(function(){
  const S = window.SITE; if(!S) return;
  const all = s => document.querySelectorAll(s);

  const vals = Object.assign({}, S, { n8n:S.n8nProof });
  all('[data-if]').forEach(el=>{ if(!S[el.dataset.if]) el.remove(); });
  all('[data-bind]').forEach(el=>{ const v=vals[el.dataset.bind]; if(v!==undefined) el.textContent=v; });

  all('[data-link]').forEach(a=>{
    const k=a.dataset.link;
    if(k==='cv'){ if(!S.cv||S.cv==='#'){ a.href='resume.html'; } else { a.href=S.cv; a.target='_blank'; a.rel='noopener'; } return; }
    const u = k==='email' ? 'mailto:'+S.email : S[k];
    if(!u||u==='#'){ a.remove(); return; }
    a.href=u; if(k!=='email'){ a.target='_blank'; a.rel='noopener'; }
  });

  const here = location.pathname.split('/').pop() || 'index.html';
  all('.links a').forEach(a=>{ if(a.getAttribute('href')===here) a.setAttribute('aria-current','page'); });

  const t=document.createElement('div'); t.id='toast'; t.setAttribute('role','status'); document.body.appendChild(t);
  let tt; const toast=m=>{ t.textContent=m; t.classList.add('show'); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('show'),2400); };
  all('[data-copy]').forEach(b=>b.addEventListener('click',()=>{
    if(navigator.clipboard) navigator.clipboard.writeText(S.email).then(()=>toast('คัดลอกอีเมลแล้ว: '+S.email),()=>location.href='mailto:'+S.email);
    else location.href='mailto:'+S.email; }));
  all('[data-print]').forEach(b=>b.addEventListener('click',()=>{
    const prevTitle=document.title;
    document.title=(S.nameEn||'Resume').replace(/\s+/g,'_')+'_Resume';
    const restore=()=>{ document.title=prevTitle; window.removeEventListener('afterprint',restore); };
    window.addEventListener('afterprint',restore);
    window.print();
  }));

  all('.buddy').forEach(b=>b.innerHTML='<div class="arm"></div><div class="body"></div><div class="head"></div><div class="hair"></div><div class="eye l"></div><div class="eye r"></div><div class="mouth"></div>');

  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{ threshold:.12 });
  all('.rv').forEach((el,i)=>{ el.style.transitionDelay=(el.classList.contains('fact')||el.classList.contains('card')?(i%4)*70:0)+'ms'; io.observe(el); });
  window.addEventListener('beforeprint',()=>all('.rv').forEach(el=>el.classList.add('in')));
})();

/* ===== แสงตามเมาส์: ส่วนไหนอยากได้ ใส่ data-glow ที่แท็กนั้น ===== */
(function(){
  if(!matchMedia('(hover: hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-glow]').forEach(el=>{
    const g=document.createElement('span'); g.className='mglow'; g.setAttribute('aria-hidden','true'); el.appendChild(g);
    let tx=0, ty=0, x=0, y=0, raf=0;
    const tick=()=>{ x+=(tx-x)*.15; y+=(ty-y)*.15; g.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;
      raf = Math.abs(tx-x)+Math.abs(ty-y) > .5 ? requestAnimationFrame(tick) : 0; };
    el.addEventListener('pointermove',e=>{ const r=el.getBoundingClientRect(); tx=e.clientX-r.left; ty=e.clientY-r.top;
      if(!g.classList.contains('on')){ x=tx; y=ty; } g.classList.add('on'); if(!raf) raf=requestAnimationFrame(tick); });
    el.addEventListener('pointerleave',()=>g.classList.remove('on'));
  });
})();
