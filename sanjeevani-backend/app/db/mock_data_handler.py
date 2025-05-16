import json
import os
from pathlib import Path

class MockDataHandler:
    def __init__(self):
        self.base_path = Path(__file__).parent.parent / "mock_data"
        self.data = {}
        self._load_data()
    
    def _load_data(self):
        for file_path in self.base_path.glob("*.json"):
            collection_name = file_path.stem
            with open(file_path, "r") as f:
                self.data[collection_name] = json.load(f)
    
    async def find_one(self, collection, query):
        if collection not in self.data:
            return None
        
        for item in self.data[collection]:
            match = True
            for key, value in query.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            
            if match:
                return item
        
        return None
    
    async def find(self, collection, query=None, limit=None):
        if collection not in self.data:
            return []
        
        if query is None:
            results = self.data[collection]
        else:
            results = []
            for item in self.data[collection]:
                match = True
                for key, value in query.items():
                    if key not in item or item[key] != value:
                        match = False
                        break
                
                if match:
                    results.append(item)
        
        if limit is not None:
            results = results[:limit]
        
        return results
    
    async def insert_one(self, collection, document):
        if collection not in self.data:
            self.data[collection] = []
        
        self.data[collection].append(document)
        self._save_data(collection)
        
        return {"inserted_id": document["id"]}
    
    async def update_one(self, collection, query, update):
        if collection not in self.data:
            return {"modified_count": 0}
        
        modified_count = 0
        for i, item in enumerate(self.data[collection]):
            match = True
            for key, value in query.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            
            if match:
                # Handle  operator
                if "" in update:
                    for key, value in update[""].items():
                        self.data[collection][i][key] = value
                
                modified_count += 1
                self._save_data(collection)
                break
        
        return {"modified_count": modified_count}
    
    async def delete_one(self, collection, query):
        if collection not in self.data:
            return {"deleted_count": 0}
        
        deleted_count = 0
        for i, item in enumerate(self.data[collection]):
            match = True
            for key, value in query.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            
            if match:
                del self.data[collection][i]
                deleted_count += 1
                self._save_data(collection)
                break
        
        return {"deleted_count": deleted_count}
    
    def _save_data(self, collection):
        file_path = self.base_path / f"{collection}.json"
        with open(file_path, "w") as f:
            json.dump(self.data[collection], f, indent=2)

mock_db = MockDataHandler()
