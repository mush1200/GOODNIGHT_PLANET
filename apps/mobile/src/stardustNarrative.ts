export function stardustNarrative(balance: number | undefined): string | null {
  if (typeof balance !== 'number') return null;
  if (balance <= 0) return '星塵還在慢慢聚成光點。';
  if (balance < 12) return `星塵像細沙一樣在掌心，約 ${balance} 粒。`;
  return `星塵已經聚成一小捧柔光，約 ${balance} 粒。`;
}
