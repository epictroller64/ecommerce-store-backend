import { db } from './db/connection';
import { categories, products } from './db/schema';

async function testDatabaseConnection() {
    try {
        console.log('🔍 Testing database connection...');
        //basic query
        const result = await db.select().from(categories).limit(1);
        console.log('✅ Database connection successful!');
        console.log('📊 Sample query result:', result);

        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}

if (require.main === module) {
    testDatabaseConnection()
        .then((success) => {
            if (success) {
                console.log('🎉 All tests passed!');
            } else {
                console.log('💥 Tests failed!');
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error('💥 Test error:', error);
            process.exit(1);
        });
}

export { testDatabaseConnection }; 