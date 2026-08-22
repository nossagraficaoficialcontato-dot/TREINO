// FITPRO V6.2 hotfix — finalização segura da avaliação IA
window.saveAssessment=async function(e){
  e.preventDefault();
  const payload={student_id:session.user.id,status:'submitted',goal:$('#aGoal').value,sex:$('#aSex').value||null,age:+$('#aAge').value||null,height_cm:+$('#aHeight').value||null,weight_kg:+$('#aWeight').value||null,experience_level:$('#aLevel').value,training_days:+$('#aDays').value,session_minutes:+$('#aMinutes').value,training_location:$('#aLocation').value,equipment:csv($('#aEquipment').value),priority_muscles:csv($('#aPriority').value),sleep_hours:+$('#aSleep').value||null,stress_level:+$('#aStress').value||null,activity_level:$('#aActivity').value,injuries:$('#aInjuries').value.trim()||null,medical_conditions:$('#aMedical').value.trim()||null,medications:$('#aMeds').value.trim()||null,pain_current:$('#aPain').value.trim()||null,surgery_recent:$('#aSurgery').checked,chest_pain:$('#aChest').checked,fainting:$('#aFaint').checked,uncontrolled_bp:$('#aBP').checked,pregnant:$('#aPregnant').checked,preferences:$('#aPreferences').value.trim()||null,dislikes:$('#aDislikes').value.trim()||null,notes:$('#aNotes').value.trim()||null,consent:$('#aConsent').checked,answers:{version:6.2}};
  showModal('Analisando sua avaliação','<div class="loading-ai">Cruzando objetivo, rotina, experiência, recuperação e limitações…</div><div class="disclaimer">A IA fará a prescrição automaticamente. Normalmente isso leva poucos segundos.</div>');
  let safetyTimer=setTimeout(()=>{closeModal();toast('A análise está levando mais tempo que o esperado. Você pode continuar usando o app enquanto finalizamos.',true)},15000);
  try{
    const {data:a,error}=await db.from('fitpro_assessments').insert(payload).select().single();
    if(error)throw error;
    const {error:profileErr}=await db.from('fitpro_profiles').update({goal:payload.goal,updated_at:new Date().toISOString()}).eq('id',session.user.id);
    if(profileErr)console.warn('Falha ao atualizar objetivo do perfil',profileErr);
    const invokePromise=db.functions.invoke('fitpro-analyze-assessment',{body:{assessment_id:a.id}});
    const timeoutPromise=new Promise((_,reject)=>setTimeout(()=>reject(new Error('Tempo limite da análise excedido')),12000));
    const {data:fn,error:fnErr}=await Promise.race([invokePromise,timeoutPromise]);
    if(fnErr)throw fnErr;
    const p=fn?.prescription;
    if(p?.status==='ready')await publishAIPlan(p);
    await loadAll();
    if(profile)profile.goal=payload.goal;
    renderApp();
    closeModal();
    if(p){openLatestAnalysis();toast(p.status==='ready'?'Plano personalizado criado automaticamente! 🧠💪':'A prescrição automática foi bloqueada por um sinal de segurança.')}else toast('Avaliação concluída. Atualizando seu plano…');
  }catch(err){
    console.error('Assessment flow error',err);
    closeModal();
    try{await loadAll();renderApp()}catch(_e){}
    toast('Sua avaliação foi salva, mas a finalização do plano teve um problema: '+(err.message||'erro inesperado'),true);
  }finally{clearTimeout(safetyTimer)}
};
