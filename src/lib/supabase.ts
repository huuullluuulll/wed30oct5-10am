import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://luhmqzfpwmctfrugtkdm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1aG1xemZwd21jdGZydWd0a2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwNjg3MjksImV4cCI6MjA0NTY0NDcyOX0.krUZHdV30KsfTgNObhSvSWasFggdNnujo14C5YM1sms';

export const supabase = createClient(supabaseUrl, supabaseKey);