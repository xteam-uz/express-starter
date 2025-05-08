export function getKeyName(...args: string[]) {
  return `express-starter:${args.join(":")}`;
}
