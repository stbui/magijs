export function getTypedName(name) {
  return `@types/${name.replace(/^@/, '').replace('/', '__')}`;
}
