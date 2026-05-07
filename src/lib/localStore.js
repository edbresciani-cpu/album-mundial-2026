import { STORAGE_KEY, emptyProgress, normalizeProgress, openDigitalPack } from '../data/albumData';

export function loadLocalProgress() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return emptyProgress();

  try {
    return normalizeProgress(JSON.parse(saved));
  } catch {
    return emptyProgress();
  }
}

export function saveLocalProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function openLocalPack(progress) {
  const next = openDigitalPack(progress);
  saveLocalProgress(next);
  return next;
}
