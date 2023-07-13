import { MongoClient } from 'mongodb';

export const getProducts = async () => {
	const mongoClient = new MongoClient(
		'mongodb+srv://SmokeLabStock:AYJGRHx7S7xqKkpm@cluster0.t0hc25p.mongodb.net/?retryWrites=true&w=majority',
	);

	try {
		await mongoClient.connect();

		const collection = mongoClient.db().collection('smoke-lab-stock');
		const data = await collection.find({}).toArray();

		console.log(data);
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
	} finally {
		await mongoClient.close();
	}
};
