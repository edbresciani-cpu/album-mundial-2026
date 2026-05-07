import { computeAchievementProgress } from '../data/achievements';

export async function syncAchievements(supabase, userId, progress) {
  const achievements = computeAchievementProgress(progress).map((item) => ({
    user_id: userId,
    achievement_code: item.id,
    current_value: item.current,
    target_value: item.target,
    completed_at: item.completed ? new Date().toISOString() : null,
  }));

  const { error } = await supabase.from('user_achievements').upsert(achievements, {
    onConflict: 'user_id,achievement_code',
  });

  if (error) throw error;
}
