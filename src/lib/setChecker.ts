const LAST_KNOWN_SET_KEY = "pocketjudge_last_known_set";

export async function syncLatestSet(): Promise<void> {
  try {
    const res = await fetch("https://api.scryfall.com/sets");
    if (!res.ok) return;
    const data = await res.json();

    const relevantTypes = ["core", "expansion", "masters", "draft_innovation", "commander"];
    const now = new Date();
    const sets = data.data.filter(
      (s: any) =>
        relevantTypes.includes(s.set_type) &&
        s.released_at &&
        new Date(s.released_at) <= now
    );

    if (sets.length === 0) return;

    sets.sort((a: any, b: any) => new Date(b.released_at).getTime() - new Date(a.released_at).getTime());
    const newest = sets[0];

    if (typeof window !== "undefined") {
      localStorage.setItem(LAST_KNOWN_SET_KEY, newest.code);
    }
  } catch {
    // Silent fail — not critical
  }
}
