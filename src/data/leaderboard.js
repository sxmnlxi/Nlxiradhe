const NAME_POOL = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Ayaan', 'Krishna',
  'Ishaan', 'Shaurya', 'Atharv', 'Kabir', 'Ansh', 'Advik', 'Rudra', 'Sai',
  'Aryan', 'Dev', 'Yash', 'Om', 'Ananya', 'Diya', 'Aadhya', 'Kiara', 'Myra',
  'Sara', 'Isha', 'Riya', 'Anika', 'Navya', 'Priya', 'Neha', 'Pooja', 'Simran',
];

function generateLeaderboard(maxCoins) {
  const list = NAME_POOL.map((name, i) => {
    const spread = 0.85 + (0.3 * ((i * 37) % 10)) / 10;
    const coins = Math.round(maxCoins * (1 - i / NAME_POOL.length) * spread);
    return { name, coins: Math.max(coins, 5) };
  });
  list.sort((a, b) => b.coins - a.coins);
  return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
}

export const LEADERBOARD = {
  daily: generateLeaderboard(500),
  weekly: generateLeaderboard(2500),
  monthly: generateLeaderboard(9000),
};
