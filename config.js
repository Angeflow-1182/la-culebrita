/* Configuración pública. La clave "anon/publishable" de Supabase está pensada para ser pública (la protege RLS).
   NUNCA pongas aquí la clave "service_role" ni "secret". Los correos pueden ser inventados (no se envían mensajes). */
window.CULEBRITA_CONFIG={
  supabaseUrl:'',   // ej: https://abcdxyz.supabase.co
  anonKey:'',       // clave anon / publishable
  players:[
    {slot:1,email:'jugador1@familia-culebrita.com'},
    {slot:2,email:'jugador2@familia-culebrita.com'},
    {slot:3,email:'jugador3@familia-culebrita.com'},
    {slot:4,email:'jugador4@familia-culebrita.com'}
  ]
};
