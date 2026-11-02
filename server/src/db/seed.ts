import { faker } from '@faker-js/faker';
import db from './index.js';

const count = 10_000;
const nationalities = [
  'Emirati', 'British', 'Indian', 'Canadian', 'Egyptian',
  'American', 'Australian', 'Brazilian', 'Chinese', 'Lebanese',
  'Jordanian', 'French', 'Turkish', 'Greek', 'Irish',
  'Italian', 'Japanese', 'Kenyan', 'Omani', 'Moroccan',
  'Kuwaiti', 'Norwegian', 'Saudi', 'Qatari', 'Bahraini',
];
const hobbyNames = [
  'Reading', 'Swimming', 'Running', 'Cycling', 'Cooking',
  'Gardening', 'Photography', 'Painting', 'Drawing', 'Hiking',
  'Camping', 'Fishing', 'Dancing', 'Singing',
  'Gaming', 'Yoga', 'Tennis', 'Football', 'Basketball',
  'Travel', 'Knitting', 'Writing', 'Pottery', 'Baking',
];

try {
  const insertUser = db.prepare(`
    INSERT INTO users (
      avatar, first_name, last_name, age, nationality
    ) VALUES (
      @avatar, @first_name, @last_name, @age, @nationality
    )
  `);
  const insertHobby = db.prepare(`
    INSERT INTO hobbies (name) VALUES (?) ON CONFLICT(name) DO NOTHING
  `);
  const selectHobbies = db.prepare<[], { id: number }>('SELECT id FROM hobbies');
  const insertUserHobby = db.prepare(`
    INSERT INTO user_hobbies (user_id, hobby_id) VALUES (?, ?)
  `);

  const seed = db.transaction(() => {
    for (const name of hobbyNames) {
      insertHobby.run(name);
    }

    const hobbies = selectHobbies.all();

    for (let i = 0; i < count; i++) {
      const { lastInsertRowid } = insertUser.run({
        avatar: faker.image.avatar(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 80 }),
        nationality: faker.helpers.arrayElement(nationalities),
      });

      for (const hobby of faker.helpers.arrayElements(hobbies, { min: 0, max: 10 })) {
        insertUserHobby.run(lastInsertRowid, hobby.id);
      }
    }
  });

  console.time('Seed users');
  seed();
  console.timeEnd('Seed users');

  console.log(`Inserted ${count} users with hobby relationships.`);
} finally {
  db.close();
}