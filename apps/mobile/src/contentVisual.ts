export function goodnightLineVisualVariant(line: string): number {
  let hash = 0;
  for (let i = 0; i < line.length; i += 1) {
    hash = (hash + line.charCodeAt(i) * (i + 1)) % 997;
  }
  return hash % 3;
}

export function dreamVisualAccent(dreamKey: string | undefined, nightSkyKey: string | undefined): string {
  return `${dreamKey ?? 'default'}:${nightSkyKey ?? 'clear_star'}`;
}
