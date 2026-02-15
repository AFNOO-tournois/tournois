// Supabase Edge Function: fetch Roblox profile and update participant row.
// Triggered by Database Webhook on participants INSERT (no browser call = no CORS).
// Deploy: supabase functions deploy fetch-roblox-profile
// Set secret: supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
// In Dashboard: Database → Webhooks → Add webhook on table "participants", event INSERT,
//   URL: https://<project-ref>.supabase.co/functions/v1/fetch-roblox-profile

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

const ROBLOX_USERS_URL = 'https://users.roblox.com/v1/usernames/users';
const ROBLOX_THUMBNAILS_URL = 'https://thumbnails.roblox.com/v1/users/avatar-headshot';

interface RobloxUserLookup {
  id: number;
  name: string;
  displayName?: string;
  requestedUsername: string;
}

interface WebhookPayload {
  type?: string;
  table?: string;
  record?: { id?: string; roblox_username?: string; tournament_id?: string };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as WebhookPayload & { username?: string; participant_id?: string };

    let username: string;
    let participant_id: string | undefined;

    // Database Webhook: participants INSERT (triggered server-side, no CORS)
    if (body.type === 'INSERT' && body.table === 'participants' && body.record) {
      const record = body.record;
      participant_id = record.id;
      username = (record.roblox_username || '').toString().trim();
      if (!username || !participant_id) {
        return json({ ok: true, skipped: 'missing record fields' }, 200);
      }
      const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      if (!serviceRole || !supabaseUrl) {
        return json({ ok: true, skipped: 'no service role' }, 200);
      }
      const supabase = createClient(supabaseUrl, serviceRole);
      const { data: tournament } = await supabase
        .from('tournaments')
        .select('game_platform')
        .eq('id', record.tournament_id)
        .single();
      const platform = (tournament?.game_platform || '').toString().toLowerCase();
      if (platform !== 'roblox') {
        return json({ ok: true, skipped: 'not roblox tournament' }, 200);
      }
    } else {
      // Direct payload (e.g. from client or other caller)
      username = body.username;
      participant_id = body.participant_id;
      if (!username || typeof username !== 'string') {
        return json({ error: 'username required' }, 400);
      }
    }

    const trimmed = username.trim();
    if (trimmed.length < 3) {
      return json({ error: 'username too short' }, 400);
    }

    // 1) Get user id + display name from Roblox
    const userRes = await fetch(ROBLOX_USERS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [trimmed], excludeBannedUsers: false }),
    });

    if (!userRes.ok) {
      console.error('Roblox users API error', userRes.status, await userRes.text());
      // Fail silently: don't update participant; UI will show controller placeholder
      return json({ found: false });
    }

    const userData = (await userRes.json()) as { data: RobloxUserLookup[] };
    const user = userData?.data?.[0];
    if (!user?.id) {
      // User not found (typo, or username from another platform e.g. Kahoot) – fail silently
      return json({ found: false });
    }

    const roblox_user_id = user.id;
    const roblox_display_name = user.displayName ?? user.name ?? trimmed;

    // 2) Get avatar headshot URL
    const thumbUrl = `${ROBLOX_THUMBNAILS_URL}?userIds=${roblox_user_id}&size=150x150&format=Png`;
    const thumbRes = await fetch(thumbUrl);
    let roblox_avatar_url: string | null = null;
    if (thumbRes.ok) {
      const thumbData = (await thumbRes.json()) as { data?: { imageUrl?: string }[] };
      roblox_avatar_url = thumbData?.data?.[0]?.imageUrl ?? null;
    }

    const payload = {
      roblox_user_id,
      roblox_display_name,
      roblox_avatar_url,
    };

    // 3) Optionally update participant row (requires service role)
    if (participant_id && typeof participant_id === 'string') {
      const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      if (serviceRole && supabaseUrl) {
        const supabase = createClient(supabaseUrl, serviceRole);
        const { error } = await supabase
          .from('participants')
          .update({
            roblox_user_id,
            roblox_display_name,
            roblox_avatar_url,
          })
          .eq('id', participant_id);

        if (error) {
          console.error('Supabase update error', error);
          return json({ ...payload, update_error: error.message }, 200);
        }
      }
    }

    return json(payload);
  } catch (e) {
    console.error(e);
    return json({ error: String(e) }, 500);
  }
});

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
