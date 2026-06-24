const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: '.env.local', override: true });

const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;
const includeUsers = process.argv.includes('--include-users');

const sampleCategorySlugs = [
  'nha-hang-cafe',
  'spa-lam-dep',
  'bat-dong-san',
  'giao-duc-khoa-hoc',
  'garage-o-to',
  'du-lich-khach-san',
];

const sampleLandingPageSlugs = [
  'gourmet-palace-landing-page',
  'serenity-spa-landing-page',
  'vinhomes-premium-landing-page',
];

const sampleBlogSlugs = [
  'toi-uu-landing-page-chuan-seo',
  '5-loi-sut-giam-chuyen-doi',
];

async function removeMany(collection, filter) {
  const result = await mongoose.connection.db.collection(collection).deleteMany(filter);
  console.log(`${collection}: deleted ${result.deletedCount}`);
}

(async () => {
  if (!uri) {
    console.error('Missing DATABASE_URL or MONGODB_URI.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`Connected: ${mongoose.connection.db.databaseName}`);

    await removeMany('landingpages', { slug: { $in: sampleLandingPageSlugs } });
    await removeMany('blogposts', { slug: { $in: sampleBlogSlugs } });
    await removeMany('categories', { slug: { $in: sampleCategorySlugs } });

    if (includeUsers) {
      await removeMany('users', { email: { $in: ['admin@vietkey.vn', 'editor@vietkey.vn'] } });
    } else {
      console.log('users: skipped sample admin/editor. Add --include-users to remove them.');
    }

    await mongoose.disconnect();
    console.log('Sample cleanup complete.');
  } catch (error) {
    console.error('Sample cleanup failed.');
    console.error(`${error.name}: ${error.message}`);
    process.exit(1);
  }
})();
