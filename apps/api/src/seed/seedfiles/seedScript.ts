import Roles from './roles';
import User from './user';

const seeders: { [key: string]: { run: () => Promise<void> } } = {
  role: Roles,
  user: User,
};

const seeder = async (seedName?: string) => {
  if (seedName) {
    const seed = seeders[seedName];
    if (!seed) return console.error('invalid seed name');

    try {
      await seed.run();
    } catch (e) {
      console.error(`Error seeding ${seedName}`);
      console.error(e);
    }
  } else {
    try {
      console.log("seeding started");
      await Roles.run(); await User.run();
    } catch (e) {
      console.error('seeding failed');
      console.error(e);
      return;
    }
  }
};

export default seeder;
