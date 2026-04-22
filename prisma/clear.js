const prisma = require('../src/lib/prisma');

async function main() {
  console.log('Clearing data...');
  await prisma.comment.deleteMany();
  await prisma.image.deleteMany();
  console.log('Done. Users preserved.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
