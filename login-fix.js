(function(){
  'use strict';
  const SUPABASE_URL='https://ciqzrrpsnhbsqafpbdsu.supabase.co';
  const SUPABASE_KEY='sb_publishable_L_KJL0I0Xzu9Mdt8mYGPVw_LvbjICBM';
  if(!window.supabase) return;
  const authDb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  function statusBox(){
    let el=document.getElementById('authStatus');
    if(!el){
      const form=document.getElementById('auth');
      if(!form) return null;
      el=document.createElement('div');
      el.id='authStatus';
      el.style.cssText='margin-top:10px;font-size:12px;line-height:1.4;color:#ffadb4;min-height:17px';
      form.appendChild(el);
    }
    return el;
  }
  document.addEventListener('click',async function(e){
    const btn=e.target.closest('[data-mode="login"]');
    if(!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const email=(document.getElementById('email')?.value||'').trim();
    const password=document.getElementById('pass')?.value||'';
    const status=statusBox();
    if(!email||!password){if(status)status.textContent='Informe e-mail e senha.';return;}
    const old=btn.textContent;
    btn.disabled=true;btn.textContent='Entrando...';
    if(status){status.style.color='#8e99a6';status.textContent='Validando sua conta...';}
    try{
      const {data,error}=await authDb.auth.signInWithPassword({email,password});
      if(error) throw error;
      if(!data?.session) throw new Error('Sessão não foi criada.');
      if(status){status.style.color='#c6ff36';status.textContent='Login realizado. Abrindo painel...';}
      setTimeout(()=>location.reload(),150);
    }catch(err){
      if(status){status.style.color='#ffadb4';status.textContent=err?.message||String(err);}
      btn.disabled=false;btn.textContent=old;
    }
  },true);
})();