import escape from 'lodash/escape'

let leaderboard = null
let rows = null

export function initLeaderboardElement() {
  leaderboard = document.getElementById('leaderboard')
  rows = document.querySelectorAll('#leaderboard table tr')
}

export function updateLeaderboard(leaderboard) {
  if (!rows) return
  for (let i = 0; i < leaderboard.length; i++) {
    rows[i + 1].innerHTML = `<td>${escape(leaderboard[i].name.slice(15, 0)) || 'Аноним'}</td><td>${
        leaderboard[i].score
    }</td>`
  }
  for (let i = leaderboard.length; i < 5; i++) {
    rows[i + 1].innerHTML = '<td>-</td><td>-</td>'
  }
}

export function setLeaderboardHidden(hidden) {
  if (!leaderboard) return
  if (hidden) {
    leaderboard.classList.add('hidden')
  } else {
    leaderboard.classList.remove('hidden')
  }
}
