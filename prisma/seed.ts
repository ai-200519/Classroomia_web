import { PrismaClient } from "../app/generated/prisma";
const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: 'Développement web' },
        { name: 'Data science' },
        { name: 'Cybersecrity' },
        { name: 'Développement mobile' },
        { name: 'Intelligence Artificielle' },
        { name: 'Language de programmation' },
        { name: 'Base de données' },
        { name: 'Algorithms and basics' },
        { name: 'Systèmes d exploitation' },
        { name: 'Réseaux et télécommunications' },
        { name: 'Cloud computing' },
        { name: 'DevOps' },
        { name: 'Blockchain et cryptomonnaies' },
        { name: 'Design et UX/UI' },
      ], skipDuplicates: true,

    });
    console.log('Database categories seeded');
  } catch (error){
    console.log('Error of seeding the database categories', error);
  } finally {
    await database.$disconnect();
  }
}

main();