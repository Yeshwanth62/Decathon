import os
from motor.motor_asyncio import AsyncIOMotorClient
from .mock_data_handler import mock_db

USE_MOCK_DATA = os.getenv("USE_MOCK_DATA", "false").lower() == "true"

class Database:
    client = None
    db = None
    
    @classmethod
    async def connect(cls):
        if USE_MOCK_DATA:
            print("Using mock data instead of MongoDB")
            return
        
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        mongodb_db_name = os.getenv("MONGODB_DB_NAME", "sanjeevani")
        
        cls.client = AsyncIOMotorClient(mongodb_url)
        cls.db = cls.client[mongodb_db_name]
        print(f"Connected to MongoDB: {mongodb_url}/{mongodb_db_name}")
    
    @classmethod
    async def close(cls):
        if not USE_MOCK_DATA and cls.client:
            cls.client.close()
            print("Closed MongoDB connection")
    
    @classmethod
    async def get_collection(cls, collection_name):
        if USE_MOCK_DATA:
            return MockCollection(collection_name)
        
        return cls.db[collection_name]

class MockCollection:
    def __init__(self, collection_name):
        self.collection_name = collection_name
    
    async def find_one(self, query):
        return await mock_db.find_one(self.collection_name, query)
    
    async def find(self, query=None, limit=None):
        return await mock_db.find(self.collection_name, query, limit)
    
    async def insert_one(self, document):
        return await mock_db.insert_one(self.collection_name, document)
    
    async def update_one(self, query, update):
        return await mock_db.update_one(self.collection_name, query, update)
    
    async def delete_one(self, query):
        return await mock_db.delete_one(self.collection_name, query)

database = Database()
