import { albumCards, emptyProgress, getWeekKey } from '../data/albumData';

const cardById = new Map(albumCards.map((card) => [card.id, card]));

function toOwnedMap(rows) {
  const owned = {};
  for (const row of rows || []) {
    owned[row.sticker_id] = row.quantity;
  }
  return owned;
}

function hydrateCards(cards) {
  return (cards || []).map((card) => {
    const base = cardById.get(card.id) || {};
    return { ...base, ...card };
  });
}

export async function ensureProfile(supabase, user) {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email,
      display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Jugador',
    },
    { onConflict: 'id' }
  );

  if (error) throw error;
}

export async function loadCloudProgress(supabase, user) {
  await ensureProfile(supabase, user);

  const currentWeek = getWeekKey();
  const [{ data: inventoryRows, error: inventoryError }, { data: weeklyRow, error: weeklyError }, { data: openings, error: openingsError }] =
    await Promise.all([
      supabase.from('user_stickers').select('sticker_id, quantity').eq('user_id', user.id),
      supabase
        .from('weekly_limits')
        .select('week_key, packs_opened, lifetime_packs_opened')
        .eq('user_id', user.id)
        .eq('week_key', currentWeek)
        .maybeSingle(),
      supabase
        .from('pack_openings')
        .select('cards')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1),
    ]);

  if (inventoryError) throw inventoryError;
  if (weeklyError) throw weeklyError;
  if (openingsError) throw openingsError;

  const totalPacksOpened = weeklyRow?.lifetime_packs_opened || 0;

  return {
    ...emptyProgress(),
    owned: toOwnedMap(inventoryRows),
    weekKey: currentWeek,
    packsOpenedThisWeek: weeklyRow?.packs_opened || 0,
    lastPack: hydrateCards(openings?.[0]?.cards || []),
    totalPacksOpened,
  };
}

export async function openCloudPack(supabase) {
  const { data, error } = await supabase.rpc('open_weekly_pack');
  if (error) throw error;

  const rows = data?.inventory || [];
  return {
    ...emptyProgress(),
    owned: toOwnedMap(rows),
    weekKey: data.week_key,
    packsOpenedThisWeek: data.packs_opened,
    totalPacksOpened: data.total_packs_opened,
    lastPack: hydrateCards(data.cards || []),
  };
}

export async function loadTrades(supabase, user) {
  const { data, error } = await supabase
    .from('trade_offers')
    .select(`
      id,
      status,
      note,
      created_at,
      offered_by,
      requested_with,
      offered_by_profile:profiles!trade_offers_offered_by_fkey(id, email, display_name),
      requested_with_profile:profiles!trade_offers_requested_with_fkey(id, email, display_name),
      items:trade_offer_items(id, owner_user_id, sticker_id, quantity)
    `)
    .or(`offered_by.eq.${user.id},requested_with.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return hydrateTradeCards(data || []);
}

export function hydrateTradeCards(trades) {
  return trades.map((trade) => ({
    ...trade,
    items:
      trade.items?.map((item) => ({
        ...item,
        card: cardById.get(item.sticker_id) || null,
      })) || [],
  }));
}

export async function searchProfiles(supabase, term) {
  const { data, error } = await supabase.rpc('search_profiles', { search_term: term || '' });
  if (error) throw error;
  return data || [];
}

export async function createTradeOffer(supabase, payload) {
  const { data, error } = await supabase.rpc('create_trade_offer', {
    target_user_id: payload.targetUserId,
    offered_sticker_id: payload.offeredStickerId,
    requested_sticker_id: payload.requestedStickerId,
    offered_quantity: payload.offeredQuantity || 1,
    requested_quantity: payload.requestedQuantity || 1,
    note_text: payload.note || null,
  });
  if (error) throw error;
  return data;
}

export async function respondToTradeOffer(supabase, tradeId, nextStatus) {
  const { error } = await supabase.rpc('respond_to_trade_offer', {
    target_trade_id: tradeId,
    next_status: nextStatus,
  });
  if (error) throw error;
}
