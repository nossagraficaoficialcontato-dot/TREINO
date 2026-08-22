import{db}from'./config.js';
export async function loadProfile(uid){const{data,error}=await db.from('fitpro_profiles').select('*').eq('id',uid).single();if(error)throw error;return data}
export async function loadWorkouts(uid){const{data,error}=await db.from('fitpro_workouts').select('*,fitpro_exercises(*)').eq('student_id',uid).order('scheduled_for');if(error)throw error;return data||[]}
export async function loadLatestPrescription(uid){const{data,error}=await db.from('fitpro_ai_prescriptions').select('*').eq('student_id',uid).order('created_at',{ascending:false}).limit(1).maybeSingle();if(error)throw error;return data}
export async function loadMeasurements(uid){const{data,error}=await db.from('fitpro_measurements').select('*').eq('student_id',uid).order('measured_at',{ascending:false}).limit(20);if(error)throw error;return data||[]}
