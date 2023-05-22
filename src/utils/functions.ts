// From https://github.com/codetheweb/muse
export function chunkArray<T>(originalArray: T[], chunkSize: number) {
  const chunks = [];

  let i = 0;
  while (i < originalArray.length) {
    chunks.push(originalArray.slice(i, (i += chunkSize)));
  }

  return chunks;
}
