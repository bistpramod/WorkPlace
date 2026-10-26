import mongoose from 'mongoose';

export async function connectToDatabase(mongodbUri) {
  if (typeof mongodbUri !== 'string' || mongodbUri.trim() === '') {
    throw new Error('MONGODB_URI is required');
  }

  await mongoose.connect(mongodbUri);
  console.log('Connected to MongoDB');
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect();
}
