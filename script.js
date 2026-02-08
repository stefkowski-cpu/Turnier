const APP_VERSION = 'v1.3.0';
const DEFAULT_TEAMS = [
  'Deutschland','England','Niederlande','Spanien',
  'Italien','Portugal','Dänemark','Belgien',
  'Norwegen','Österreich','Schweden','Polen',
  'Ukraine','Griechenland','Kroatien','Serbien'
];

const LEAGUE_TEAMS = [
  { name: 'Spanien', flag: '🇪🇸' },
  { name: 'Argentinien', flag: '🇦🇷' },
  { name: 'Frankreich', flag: '🇫🇷' },
  { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Brasilien', flag: '🇧🇷' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Niederlande', flag: '🇳🇱' },
  { name: 'Marokko', flag: '🇲🇦' },
  { name: 'Belgien', flag: '🇧🇪' },
  { name: 'Deutschland', flag: '🇩🇪' },
  { name: 'Kroatien', flag: '🇭🇷' },
  { name: 'Senegal', flag: '🇸🇳' },
  { name: 'Italien', flag: '🇮🇹' },
  { name: 'Kolumbien', flag: '🇨🇴' },
  { name: 'USA', flag: '🇺🇸' },
  { name: 'Mexiko', flag: '🇲🇽' },
  { name: 'Uruguay', flag: '🇺🇾' },
  { name: 'Schweiz', flag: '🇨🇭' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'IR Iran', flag: '🇮🇷' },
  { name: 'Dänemark', flag: '🇩🇰' },
  { name: 'Republik Korea', flag: '🇰🇷' },
  { name: 'Ecuador', flag: '🇪🇨' },
  { name: 'Österreich', flag: '🇦🇹' },
  { name: 'Türkei', flag: '🇹🇷' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'Australien', flag: '🇦🇺' },
  { name: 'Algerien', flag: '🇩🇿' },
  { name: 'Kanada', flag: '🇨🇦' },
  { name: 'Ukraine', flag: '🇺🇦' },
  { name: 'Ägypten', flag: '🇪🇬' },
  { name: 'Norwegen', flag: '🇳🇴' },
  { name: 'Panama', flag: '🇵🇦' },
  { name: 'Polen', flag: '🇵🇱' },
  { name: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { name: 'Russland', flag: '🇷🇺' },
  { name: 'Elfenbeinküste', flag: '🇨🇮' },
  { name: 'Schottland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { name: 'Serbien', flag: '🇷🇸' },
  { name: 'Paraguay', flag: '🇵🇾' },
  { name: 'Ungarn', flag: '🇭🇺' },
  { name: 'Schweden', flag: '🇸🇪' },
  { name: 'Tschechien', flag: '🇨🇿' },
  { name: 'Slowakei', flag: '🇸🇰' },
  { name: 'Kamerun', flag: '🇨🇲' },
  { name: 'Griechenland', flag: '🇬🇷' },
  { name: 'Tunesien', flag: '🇹🇳' },
  { name: 'DR Kongo', flag: '🇨🇩' },
  { name: 'Rumänien', flag: '🇷🇴' },
  { name: 'Venezuela', flag: '🇻🇪' },
  { name: 'Costa Rica', flag: '🇨🇷' },
  { name: 'Usbekistan', flag: '🇺🇿' },
  { name: 'Peru', flag: '🇵🇪' },
  { name: 'Mali', flag: '🇲🇱' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'Katar', flag: '🇶🇦' },
  { name: 'Slowenien', flag: '🇸🇮' },
  { name: 'Irak', flag: '🇮🇶' },
  { name: 'Republik Irland', flag: '🇮🇪' },
  { name: 'Südafrika', flag: '🇿🇦' },
  { name: 'Saudiarabien', flag: '🇸🇦' },
  { name: 'Burkina Faso', flag: '🇧🇫' },
  { name: 'Albanien', flag: '🇦🇱' },
  { name: 'Jordanien', flag: '🇯🇴' },
];

let variant = 0;
let groupCount = 0;
let groupSize = 0;
let groups = [];
let knockoutDrawn = false;
let knockoutMatches = { qf:[], sf:[], final:null };
let customLeague = false;
let selectedTeams = new Set();

/* ── Twemoji helper ── */
function parseEmojis(el) {
  if (typeof twemoji !== 'undefined') {
    twemoji.parse(el, { folder: 'svg', ext: '.svg' });
  }
}
document.addEventListener('DOMContentLoaded', function() { parseEmojis(document.body); });

/* ── Screen navigation ── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('backBtn').style.display = (id === 'variantScreen') ? 'none' : 'block';
}

function goBack() {
  const active = document.querySelector('.screen.active');
  if (active.id === 'teamScreen') {
    showScreen('variantScreen');
  } else if (active.id === 'leagueSetupScreen') {
    showScreen('variantScreen');
  } else if (active.id === 'tournamentScreen') {
    const msg = customLeague
      ? 'Zurück zur Mannschaftsauswahl? Alle Ergebnisse gehen verloren.'
      : 'Zurück zur Mannschaftseingabe? Alle Ergebnisse gehen verloren.';
    if (confirm(msg)) {
      knockoutDrawn = false;
      showScreen(customLeague ? 'leagueSetupScreen' : 'teamScreen');
    }
  }
}

function goHome() {
  if (confirm('Zurück zur Startseite? Alle Daten gehen verloren.')) {
    knockoutDrawn = false;
    customLeague = false;
    groups = [];
    showScreen('variantScreen');
  }
}

/* ── Step 1: Variant ── */
function selectVariant(v) {
  variant = v;
  customLeague = false;
  if (v === 1) {
    groupCount = 1;
    groupSize = 16;
  } else {
    groupCount = v;
    groupSize = 16 / v;
  }
  const labels = {
    1: 'Variante C – Liga mit 16 Mannschaften',
    2: 'Variante A – 2 Gruppen × 8',
    4: 'Variante B – 4 Gruppen × 4'
  };
  document.getElementById('headerSubtitle').textContent = labels[v];
  buildTeamInputs();
  showScreen('teamScreen');
}

/* ── Liga-Erstellung (Variante D) ── */
function selectLeagueCreation() {
  customLeague = true;
  selectedTeams.clear();
  document.getElementById('headerSubtitle').textContent = 'Variante D – Liga-Erstellung';
  renderLeagueTeams();
  updateLeagueSelectionInfo();
  showScreen('leagueSetupScreen');
}

function renderLeagueTeams() {
  const grid = document.getElementById('leagueTeamGrid');
  grid.innerHTML = '';
  LEAGUE_TEAMS.forEach((team, i) => {
    const chip = document.createElement('div');
    chip.className = 'league-team-chip' + (selectedTeams.has(i) ? ' selected' : '');
    chip.onclick = () => toggleLeagueTeam(i);
    chip.innerHTML = '<span class="chip-flag">' + team.flag + '</span><span class="chip-name">' + team.name + '</span>';
    grid.appendChild(chip);
  });
  parseEmojis(grid);
}

function toggleLeagueTeam(index) {
  if (selectedTeams.has(index)) {
    selectedTeams.delete(index);
  } else {
    if (selectedTeams.size >= 32) return;
    selectedTeams.add(index);
  }
  const chips = document.getElementById('leagueTeamGrid').children;
  chips[index].classList.toggle('selected', selectedTeams.has(index));
  updateLeagueSelectionInfo();
}

function randomLeagueSelection() {
  selectedTeams.clear();
  const count = 8 + Math.floor(Math.random() * 9);
  const indices = [...Array(LEAGUE_TEAMS.length).keys()];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  indices.slice(0, count).forEach(i => selectedTeams.add(i));
  renderLeagueTeams();
  updateLeagueSelectionInfo();
}

function updateLeagueSelectionInfo() {
  const count = selectedTeams.size;
  const valid = count >= 3 && count <= 32;
  document.getElementById('leagueSelectionInfo').textContent =
    count + ' ausgewählt (3–32 erforderlich)';
  document.getElementById('leagueStartBtn').disabled = !valid;
  if (valid) {
    const n = count;
    const hinrundeDays = (n % 2 === 0) ? n - 1 : n;
    const totalDays = hinrundeDays * 2;
    const totalMatches = n * (n - 1);
    document.getElementById('leagueInfo').textContent =
      totalDays + ' Spieltage, ' + totalMatches + ' Spiele';
  } else {
    document.getElementById('leagueInfo').textContent = '';
  }
}

function startCustomLeague() {
  const teams = [...selectedTeams].map(i => LEAGUE_TEAMS[i].flag + ' ' + LEAGUE_TEAMS[i].name);
  variant = 1;
  groupCount = 1;
  groupSize = teams.length;
  groups = [{
    name: 'Liga',
    teams: teams,
    matches: generateLeagueSchedule(teams)
  }];
  knockoutDrawn = false;
  knockoutMatches = { qf:[], sf:[], final:null };
  document.getElementById('knockoutWrapper').classList.add('hidden');
  document.getElementById('headerSubtitle').textContent =
    'Variante D – Liga mit ' + teams.length + ' Mannschaften';
  renderTournament();
  showScreen('tournamentScreen');
}

/* ── Step 2: Team input ── */
function buildTeamInputs() {
  const grid = document.getElementById('teamGrid');
  grid.innerHTML = '';
  for (let g = 0; g < groupCount; g++) {
    const label = document.createElement('div');
    label.className = 'team-group-label';
    label.textContent = (variant === 1)
      ? 'Liga – ' + groupSize + ' Mannschaften'
      : 'Gruppe ' + String.fromCharCode(65 + g);
    grid.appendChild(label);
    for (let t = 0; t < groupSize; t++) {
      const idx = g * groupSize + t;
      const row = document.createElement('div');
      row.className = 'team-input-row';
      row.innerHTML =
        `<label>${t+1}.</label>` +
        `<input type="text" id="team_${idx}" value="${DEFAULT_TEAMS[idx] || ''}" />`;
      grid.appendChild(row);
    }
  }
}

/* ── Shuffle teams randomly ── */
function shuffleTeamsIntoGroups() {
  const totalTeams = groupCount * groupSize;
  const allNames = [];
  for (let i = 0; i < totalTeams; i++) {
    const el = document.getElementById('team_' + i);
    if (el) allNames.push(el.value.trim() || DEFAULT_TEAMS[i] || ('Team ' + (i+1)));
  }
  for (let i = allNames.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allNames[i], allNames[j]] = [allNames[j], allNames[i]];
  }
  for (let i = 0; i < totalTeams; i++) {
    const el = document.getElementById('team_' + i);
    if (el) el.value = allNames[i];
  }
}

/* ── Step 3: Start tournament ── */
function startTournament() {
  groups = [];
  for (let g = 0; g < groupCount; g++) {
    const teams = [];
    for (let t = 0; t < groupSize; t++) {
      const idx = g * groupSize + t;
      const name = document.getElementById('team_' + idx).value.trim() || ('Team ' + (idx+1));
      teams.push(name);
    }
    const matches = (variant === 1)
      ? generateLeagueSchedule(teams)
      : generateRoundRobin(teams);
    groups.push({
      name: (variant === 1) ? 'Liga' : 'Gruppe ' + String.fromCharCode(65 + g),
      teams,
      matches
    });
  }
  knockoutDrawn = false;
  knockoutMatches = { qf:[], sf:[], final:null };

  // Show/hide knockout
  document.getElementById('knockoutWrapper').classList.toggle('hidden', variant === 1);

  renderTournament();
  showScreen('tournamentScreen');
}

/* ── Round robin schedule (single leg) ── */
function generateRoundRobin(teams) {
  const n = teams.length;
  const matches = [];
  const list = teams.slice();
  if (n % 2 !== 0) list.push(null);
  const total = list.length;
  const rounds = total - 1;
  const half = total / 2;

  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < half; i++) {
      const home = list[i];
      const away = list[total - 1 - i];
      if (home !== null && away !== null) {
        matches.push({
          home: teams.indexOf(home),
          away: teams.indexOf(away),
          homeScore: '--',
          awayScore: '--',
          day: r + 1
        });
      }
    }
    list.splice(1, 0, list.pop());
  }
  return matches;
}

/* ── League schedule: Hin- & Rückrunde with shuffled matchdays ── */
function generateLeagueSchedule(teams) {
  const n = teams.length;
  const list = teams.slice();
  if (n % 2 !== 0) list.push(null);
  const total = list.length;
  const rounds = total - 1;
  const half = total / 2;

  // Build matchday groups for Hinrunde
  const hinrunde = [];
  for (let r = 0; r < rounds; r++) {
    const dayMatches = [];
    for (let i = 0; i < half; i++) {
      const home = list[i];
      const away = list[total - 1 - i];
      if (home !== null && away !== null) {
        dayMatches.push({ home: teams.indexOf(home), away: teams.indexOf(away) });
      }
    }
    hinrunde.push(dayMatches);
    list.splice(1, 0, list.pop());
  }

  // Shuffle Hinrunde matchday order
  shuffleArray(hinrunde);

  // Create Rückrunde (swapped home/away), also shuffled
  const rueckrunde = hinrunde.map(day =>
    day.map(m => ({ home: m.away, away: m.home }))
  );
  shuffleArray(rueckrunde);

  // Flatten into match list with day numbers
  const matches = [];
  hinrunde.forEach((day, di) => {
    day.forEach(m => {
      matches.push({
        home: m.home, away: m.away,
        homeScore: '--', awayScore: '--',
        day: di + 1, half: 1
      });
    });
  });
  rueckrunde.forEach((day, di) => {
    day.forEach(m => {
      matches.push({
        home: m.home, away: m.away,
        homeScore: '--', awayScore: '--',
        day: rounds + di + 1, half: 2
      });
    });
  });

  return matches;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* ── Render full tournament ── */
function renderTournament() {
  renderGroups();
  if (variant !== 1) {
    renderKnockout();
    checkAllGroupsDone();
  }
}

/* ── Render groups ── */
function renderGroups() {
  const wrapper = document.getElementById('groupsWrapper');
  const scrollPositions = Array.from(wrapper.querySelectorAll('.group-match-scroll')).map(el => el.scrollTop);
  wrapper.innerHTML = '';
  groups.forEach((group, gi) => {
    const panel = document.createElement('div');
    panel.className = 'group-panel' + (variant === 1 ? ' league-panel' : '');

    // Sticky top: header + table
    let stickyHTML = `<div class="group-sticky-top">
      <div class="group-panel-header">
        <span>${group.name}</span>
        <button class="group-dice-btn" onclick="randomGroupResults(${gi})">
          &#127922; Alle simulieren
        </button>
      </div>`;

    const standings = calcStandings(group);
    const qualifyCount = (variant === 2) ? 4 : (variant === 4) ? 2 : 0;
    stickyHTML += `<table class="standings-table">
      <tr><th>#</th><th>Mannschaft</th><th>Sp</th><th>S</th><th>U</th><th>N</th><th>T</th><th>GT</th><th>TD</th><th>Pkt</th></tr>`;
    standings.forEach((s, pos) => {
      const qClass = (qualifyCount > 0 && pos < qualifyCount) ? ' qualified' : '';
      stickyHTML += `<tr class="${qClass}">
        <td>${pos + 1}</td>
        <td>${s.name}</td><td>${s.played}</td>
        <td>${s.w}</td><td>${s.d}</td><td>${s.l}</td>
        <td>${s.gf}</td><td>${s.ga}</td>
        <td>${s.gd > 0 ? '+' : ''}${s.gd}</td>
        <td><strong>${s.pts}</strong></td>
      </tr>`;
    });
    stickyHTML += '</table></div>';
    panel.innerHTML = stickyHTML;

    // Scrollable match list
    const isLeague = (variant === 1);
    let matchHTML = `<div class="group-match-scroll"><div class="match-list${isLeague ? ' league-match-list' : ''}">`;
    let currentDay = 0;
    let currentHalf = 0;

    group.matches.forEach((m, mi) => {
      // Half label for league
      if (isLeague && m.half !== currentHalf) {
        currentHalf = m.half;
        currentDay = 0;
        matchHTML += `<div class="half-label">${m.half === 1 ? 'Hinrunde' : 'Rückrunde'}</div>`;
      }

      if (m.day !== currentDay) {
        currentDay = m.day;
        matchHTML += `<div class="match-day-block"><div class="match-day-label">
          <span>Spieltag ${currentDay}</span>
          <button class="matchday-dice-btn" onclick="randomMatchdayResults(${gi},${currentDay})" title="Spieltag simulieren">&#127922;</button>
        </div>`;
      }
      const hName = group.teams[m.home];
      const aName = group.teams[m.away];
      matchHTML += `
        <div class="match-row">
          <span class="match-team">${hName}</span>
          ${buildScoreControl(gi, mi, 'home', m.homeScore)}
          <span class="match-vs">:</span>
          ${buildScoreControl(gi, mi, 'away', m.awayScore)}
          <span class="match-team away">${aName}</span>
          <span class="match-actions">
            <span class="match-dice-btn" onclick="randomMatchResult(${gi},${mi})" title="Zufälliges Ergebnis">&#127922;</span>
            <span class="match-reset-btn" onclick="resetMatch(${gi},${mi})" title="Zurücksetzen">&#10005;</span>
          </span>
        </div>`;

      // Close match-day-block if next match is a different day or this is the last match
      const nextMatch = group.matches[mi + 1];
      if (!nextMatch || nextMatch.day !== currentDay || (isLeague && nextMatch.half !== currentHalf)) {
        matchHTML += '</div>'; // close match-day-block
      }
    });
    matchHTML += '</div></div>'; // close match-list + group-match-scroll
    panel.innerHTML += matchHTML;

    wrapper.appendChild(panel);
  });
  wrapper.querySelectorAll('.group-match-scroll').forEach((el, i) => {
    if (scrollPositions[i]) el.scrollTop = scrollPositions[i];
  });
  parseEmojis(wrapper);
}

function buildScoreControl(gi, mi, side, val) {
  return `<div class="score-input-wrap">
    <span class="score-arrow" onclick="changeScore(${gi},${mi},'${side}',-1)">&#9664;</span>
    <div class="score-val">${val}</div>
    <span class="score-arrow" onclick="changeScore(${gi},${mi},'${side}',1)">&#9654;</span>
  </div>`;
}

/* ── Random results ── */
function randomMatchResult(gi, mi) {
  const match = groups[gi].matches[mi];
  match.homeScore = Math.floor(Math.random() * 5);
  match.awayScore = Math.floor(Math.random() * 5);
  renderGroups();
  if (variant !== 1) checkAllGroupsDone();
}

function randomGroupResults(gi) {
  groups[gi].matches.forEach(m => {
    m.homeScore = Math.floor(Math.random() * 5);
    m.awayScore = Math.floor(Math.random() * 5);
  });
  renderGroups();
  if (variant !== 1) checkAllGroupsDone();
}

function randomMatchdayResults(gi, day) {
  groups[gi].matches.forEach(m => {
    if (m.day === day) {
      m.homeScore = Math.floor(Math.random() * 5);
      m.awayScore = Math.floor(Math.random() * 5);
    }
  });
  renderGroups();
  if (variant !== 1) checkAllGroupsDone();
}

/* ── Reset match ── */
function resetMatch(gi, mi) {
  const match = groups[gi].matches[mi];
  match.homeScore = '--';
  match.awayScore = '--';
  renderGroups();
  if (variant !== 1) checkAllGroupsDone();
}

/* ── Score change logic ── */
function changeScore(gi, mi, side, delta) {
  const match = groups[gi].matches[mi];
  const key = side === 'home' ? 'homeScore' : 'awayScore';
  const otherKey = side === 'home' ? 'awayScore' : 'homeScore';
  let cur = match[key];

  if (cur === '--') {
    if (delta > 0) {
      match[key] = 0;
      if (match[otherKey] === '--') {
        match[otherKey] = 0;
      }
    }
  } else {
    let next = cur + delta;
    if (next < 0) {
      match[key] = '--';
      match[otherKey] = '--';
    } else {
      match[key] = next;
    }
  }

  renderGroups();
  if (variant !== 1) checkAllGroupsDone();
}

/* ── Standings calculation ── */
function calcStandings(group) {
  const stats = group.teams.map((name, i) => ({
    idx: i, name, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0
  }));

  group.matches.forEach(m => {
    if (m.homeScore === '--' || m.awayScore === '--') return;
    const h = stats[m.home];
    const a = stats[m.away];
    h.played++; a.played++;
    h.gf += m.homeScore; h.ga += m.awayScore;
    a.gf += m.awayScore; a.ga += m.homeScore;
    if (m.homeScore > m.awayScore) { h.w++; a.l++; h.pts += 3; }
    else if (m.homeScore < m.awayScore) { a.w++; h.l++; a.pts += 3; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  });

  stats.forEach(s => s.gd = s.gf - s.ga);

  stats.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name);
  });

  return stats;
}

/* ── Check if all group matches have results ── */
function checkAllGroupsDone() {
  let allDone = true;
  groups.forEach(g => {
    g.matches.forEach(m => {
      if (m.homeScore === '--' || m.awayScore === '--') allDone = false;
    });
  });
  const btn = document.getElementById('drawBtn');
  btn.disabled = !allDone || knockoutDrawn;
  if (knockoutDrawn) btn.textContent = 'Auslosung erfolgt';
}

/* ═══════════════════════════════════
   KNOCKOUT STAGE
   ═══════════════════════════════════ */

function drawKnockout() {
  if (knockoutDrawn) return;
  knockoutDrawn = true;

  if (variant === 2) drawKnockoutVariant2();
  else if (variant === 4) drawKnockoutVariant4();

  document.getElementById('drawBtn').disabled = true;
  document.getElementById('drawBtn').textContent = 'Auslosung erfolgt';
  renderKnockout();
}

function drawKnockoutVariant2() {
  const sA = calcStandings(groups[0]);
  const sB = calcStandings(groups[1]);

  knockoutMatches.qf = [
    { home: sA[0].name, away: sB[3].name, homeScore: '--', awayScore: '--' },
    { home: sA[1].name, away: sB[2].name, homeScore: '--', awayScore: '--' },
    { home: sB[0].name, away: sA[3].name, homeScore: '--', awayScore: '--' },
    { home: sB[1].name, away: sA[2].name, homeScore: '--', awayScore: '--' },
  ];

  knockoutMatches.sf = [
    { home: null, away: null, homeScore: '--', awayScore: '--', fromQF: [0, 1] },
    { home: null, away: null, homeScore: '--', awayScore: '--', fromQF: [2, 3] },
  ];
  knockoutMatches.final = { home: null, away: null, homeScore: '--', awayScore: '--', fromSF: [0, 1] };
}

function drawKnockoutVariant4() {
  const winners = [];
  const runnersUp = [];
  groups.forEach(g => {
    const s = calcStandings(g);
    winners.push(s[0].name);
    runnersUp.push(s[1].name);
  });

  let attempts = 0;
  let pairing;
  do {
    const shuffled = shuffle([...runnersUp]);
    pairing = winners.map((w, i) => ({ winner: w, runnerUp: shuffled[i], wGroup: i, rGroup: runnersUp.indexOf(shuffled[i]) }));
    attempts++;
  } while (pairing.some(p => p.wGroup === p.rGroup) && attempts < 500);

  knockoutMatches.qf = pairing.map(p => ({
    home: p.winner, away: p.runnerUp, homeScore: '--', awayScore: '--'
  }));

  const si = shuffle([0, 1, 2, 3]);
  knockoutMatches.sf = [
    { home: null, away: null, homeScore: '--', awayScore: '--', fromQF: [si[0], si[1]] },
    { home: null, away: null, homeScore: '--', awayScore: '--', fromQF: [si[2], si[3]] },
  ];
  knockoutMatches.final = { home: null, away: null, homeScore: '--', awayScore: '--', fromSF: [0, 1] };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getKOWinner(match) {
  if (!match || match.homeScore === '--' || match.awayScore === '--') return null;
  if (!match.home || !match.away) return null;
  if (match.homeScore > match.awayScore) return match.home;
  if (match.awayScore > match.homeScore) return match.away;
  return null;
}

function propagateKnockout() {
  knockoutMatches.sf.forEach(sf => {
    const w0 = getKOWinner(knockoutMatches.qf[sf.fromQF[0]]);
    const w1 = getKOWinner(knockoutMatches.qf[sf.fromQF[1]]);
    const oldHome = sf.home, oldAway = sf.away;
    sf.home = w0; sf.away = w1;
    if (sf.home !== oldHome || sf.away !== oldAway) { sf.homeScore = '--'; sf.awayScore = '--'; }
  });

  const f = knockoutMatches.final;
  const w0 = getKOWinner(knockoutMatches.sf[f.fromSF[0]]);
  const w1 = getKOWinner(knockoutMatches.sf[f.fromSF[1]]);
  const oldHome = f.home, oldAway = f.away;
  f.home = w0; f.away = w1;
  if (f.home !== oldHome || f.away !== oldAway) { f.homeScore = '--'; f.awayScore = '--'; }

  const champion = getKOWinner(f);
  const banner = document.getElementById('championBanner');
  if (champion) {
    document.getElementById('champName').textContent = champion + ' ist Turniersieger!';
    banner.classList.add('visible');
  } else {
    banner.classList.remove('visible');
  }
}

function renderKnockout() {
  const container = document.getElementById('bracketContainer');
  if (!knockoutDrawn) { container.innerHTML = ''; return; }

  propagateKnockout();
  container.innerHTML = '';
  container.appendChild(buildBracketRound('Viertelfinale', knockoutMatches.qf, 'qf'));
  container.appendChild(buildBracketRound('Halbfinale', knockoutMatches.sf, 'sf'));
  container.appendChild(buildBracketRound('Finale', [knockoutMatches.final], 'final'));
  parseEmojis(document.getElementById('knockoutWrapper'));
}

function buildBracketRound(title, matches, roundKey) {
  const round = document.createElement('div');
  round.className = 'bracket-round';
  round.innerHTML = `<div class="bracket-round-title">${title}</div>`;

  const matchesDiv = document.createElement('div');
  matchesDiv.className = 'bracket-matches';

  matches.forEach((m, mi) => {
    const winner = getKOWinner(m);
    const card = document.createElement('div');
    card.className = 'bracket-match' + (winner ? ' winner-decided' : '');

    const isDraw = m.home && m.away && m.homeScore !== '--' && m.awayScore !== '--' && m.homeScore === m.awayScore;
    const canAct = m.home && m.away;
    const hasScore = m.homeScore !== '--' || m.awayScore !== '--';

    card.innerHTML =
      buildBracketTeamRow(m.home, m.homeScore, roundKey, mi, 'home', winner === m.home && winner !== null) +
      buildBracketTeamRow(m.away, m.awayScore, roundKey, mi, 'away', winner === m.away && winner !== null) +
      (isDraw ? '<div class="ko-draw-hint">Unentschieden – bitte Ergebnis ändern</div>' : '') +
      (canAct ? `<div class="bracket-match-actions">
        <button class="bracket-dice-btn" onclick="randomKOResult('${roundKey}',${mi})" title="Zufälliges Ergebnis">&#127922;</button>
        ${hasScore ? `<button class="bracket-reset-btn" onclick="resetKOMatch('${roundKey}',${mi})" title="Zurücksetzen">&#10005;</button>` : ''}
      </div>` : '');

    matchesDiv.appendChild(card);
  });

  round.appendChild(matchesDiv);
  return round;
}

function buildBracketTeamRow(name, score, roundKey, mi, side, isWinner) {
  const displayName = name || 'TBD';
  const nameClass = name ? 'bracket-team-name' : 'bracket-team-name tbd';
  const winClass = isWinner ? ' is-winner' : '';
  const canEdit = !!name;

  let scoreHTML;
  if (canEdit) {
    scoreHTML = `<div class="bracket-score-wrap">
      <span class="bracket-score-arrow" onclick="changeKOScore('${roundKey}',${mi},'${side}',-1)">&#9664;</span>
      <div class="bracket-score-val">${score}</div>
      <span class="bracket-score-arrow" onclick="changeKOScore('${roundKey}',${mi},'${side}',1)">&#9654;</span>
    </div>`;
  } else {
    scoreHTML = `<div class="bracket-score-wrap"><div class="bracket-score-val">--</div></div>`;
  }

  return `<div class="bracket-team-row${winClass}">
    <span class="${nameClass}">${displayName}</span>
    ${scoreHTML}
  </div>`;
}

function randomKOResult(roundKey, mi) {
  let match;
  if (roundKey === 'qf') match = knockoutMatches.qf[mi];
  else if (roundKey === 'sf') match = knockoutMatches.sf[mi];
  else match = knockoutMatches.final;
  if (!match.home || !match.away) return;

  do {
    match.homeScore = Math.floor(Math.random() * 5);
    match.awayScore = Math.floor(Math.random() * 5);
  } while (match.homeScore === match.awayScore);

  renderKnockout();
}

function resetKOMatch(roundKey, mi) {
  let match;
  if (roundKey === 'qf') match = knockoutMatches.qf[mi];
  else if (roundKey === 'sf') match = knockoutMatches.sf[mi];
  else match = knockoutMatches.final;

  match.homeScore = '--';
  match.awayScore = '--';
  renderKnockout();
}

function changeKOScore(roundKey, mi, side, delta) {
  let match;
  if (roundKey === 'qf') match = knockoutMatches.qf[mi];
  else if (roundKey === 'sf') match = knockoutMatches.sf[mi];
  else match = knockoutMatches.final;

  if (!match.home || !match.away) return;

  const key = side === 'home' ? 'homeScore' : 'awayScore';
  const otherKey = side === 'home' ? 'awayScore' : 'homeScore';
  let cur = match[key];

  if (cur === '--') {
    if (delta > 0) {
      match[key] = 0;
      if (match[otherKey] === '--') match[otherKey] = 0;
    }
  } else {
    let next = cur + delta;
    if (next < 0) {
      match[key] = '--';
      match[otherKey] = '--';
    } else {
      match[key] = next;
    }
  }

  renderKnockout();
}
