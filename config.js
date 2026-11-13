/* Configuración pública. La clave "anon/publishable" de Supabase está pensada para ser pública (la protege RLS).
   NUNCA pongas aquí la clave "service_role" ni "secret". Los correos pueden ser inventados (no se envían mensajes). */
window.CULEBRITA_CONFIG={
  supabaseUrl:'https://wjvockdsizsasqrkxofj.supabase.co',   // ej: https://abcdxyz.supabase.co
  anonKey:'sb_publishable_xir-h3Z9y871o79Xuz-LoQ_Yfs1lQBR',       // clave anon / publishable
  // Los usuarios nuevos siguen el mismo patrón: jugador5@familia-culebrita.com, etc.
  // Crear primero la cuenta en Supabase Authentication y su perfil vinculado.
  playerEmailPattern:'jugador{slot}@familia-culebrita.com',
  players:[
    {slot:1,email:'jugador1@familia-culebrita.com'},
    {slot:2,email:'jugador2@familia-culebrita.com'},
    {slot:3,email:'jugador3@familia-culebrita.com'},
    {slot:4,email:'jugador4@familia-culebrita.com'}
  ]
};
