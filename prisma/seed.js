const prisma = require('../src/lib/prisma');
const data = require('../src/data/data.json');

async function main() {
  console.log('Seeding database...');

  for (const user of data.users) {
    await prisma.user.create({
      data: {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  for (const image of data.images) {
    await prisma.image.create({
      data: {
        id: image.id,
        userId: image.userId,
        name: image.name,
        description: image.description,
        likes: image.likes,
        views: image.views,
      },
    });
  }

  for (const comment of data.comments) {
    await prisma.comment.create({
      data: {
        id: comment.id,
        userId: comment.userId,
        imageId: comment.imageId,
        comment: comment.comment,
      },
    });
  }

  console.log('Done!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
