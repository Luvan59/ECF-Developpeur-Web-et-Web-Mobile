import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI manquant dans .env");
}

if (!dbName) {
  throw new Error("MONGODB_DB manquant dans .env");
}

const globalForMongo = global as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient>;

if (!globalForMongo.mongoClientPromise) {
  const client = new MongoClient(uri);
  globalForMongo.mongoClientPromise = client.connect();
}

clientPromise = globalForMongo.mongoClientPromise;

export async function getMongoDb() {
  const client = await clientPromise;
  return client.db(dbName);
}
