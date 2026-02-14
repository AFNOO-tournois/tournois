// Supabase Edge Function: fetch Roblox profile (display name + avatar) and optionally update participant row.
// Deploy: supabase functions deploy fetch-roblox-profile
// Set secret for DB updates: supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ROBLOX_USERS_URL = 'https://users.roblox.com/v1/usernames/users';
const ROBLOX_THUMBNAILS_URL = 'https://thumbnails.roblox.com/v1/users/avatar-headshot';

interface RobloxUserLookup {
  id: number;
  name: string;
  displayName?: string;
  requestedUsername: string;
}

interface RequestBody {
  username: string;
  participant_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { ...cors(), 'Access-Control-Max-Age': '86400' } });
  }

  try {
    const body = (await req.json()) as RequestBody;
    const { username, participant_id } = body;

    if (!username || typeof username !== 'string') {
      return json({ error: 'username required' }, 400);
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
    headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  };
}
