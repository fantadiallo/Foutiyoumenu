const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function expandDaysLabel(label) {
  const parts = label.split(/[,\s]+/).filter(Boolean);
  const out = new Set();
  for (const p of parts) {
    if (p.includes("–")) {
      const [a,b] = p.split("–");
      const ai = DAYS.indexOf(a);
      const bi = DAYS.indexOf(b);
      if (ai === -1 || bi === -1) continue;
      if (ai <= bi) {
        for (let i = ai; i <= bi; i++) out.add(DAYS[i]);
      } else {
        for (let i = ai; i < ai + 7; i++) out.add(DAYS[i % 7]);
        for (let i = 0; i <= bi; i++) out.add(DAYS[i]);
      }
    } else {
      if (DAYS.includes(p)) out.add(p);
    }
  }
  return [...out];
}

function toMinutes(hhmm) {
  const [H,M] = String(hhmm).split(":").map(Number);
  return (H||0)*60 + (M||0);
}

function todayWindows(configHours, date = new Date()) {
  const day = DAYS[date.getDay()];
  const list = [];
  for (const row of configHours || []) {
    const labels = expandDaysLabel(row.days || "");
    if (labels.includes(day)) {
      for (const [open, close] of row.windows || []) {
        list.push({ openMin: toMinutes(open), closeMin: toMinutes(close), open, close });
      }
    }
  }
  return list.sort((a,b) => a.openMin - b.openMin);
}

export function getOpenStatus(configHours, date = new Date()) {
  const mins = date.getHours()*60 + date.getMinutes();
  const windows = todayWindows(configHours, date);

  for (const w of windows) {
    if (mins >= w.openMin && mins <= w.closeMin) {
      return { isOpen: true, label: `Open until ${w.close}`, nextChangeMin: w.closeMin };
    }
  }

  const next = windows.find(w => mins < w.openMin);
  if (next) return { isOpen: false, label: `Opens at ${next.open}`, nextChangeMin: next.openMin };

  return { isOpen: false, label: "Closed today", nextChangeMin: null };
}
