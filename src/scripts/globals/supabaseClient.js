import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agrkvdjeigkdgdjapvuo.supabase.co'; // Ganti dengan URL project kamu
const supabaseKey = process.env.API_KEY; // Ganti dengan anon public key dari project kamu
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
