import seeder from './seedfiles/seedScript';

let seedName: string | undefined;
const args = process.argv.slice(2);
console.log({ args });
if (args.length >= 1) seedName = args[0];

seeder(seedName)
  .then(() => console.log('Seed complete'))
  .catch((e) => console.error(e));
