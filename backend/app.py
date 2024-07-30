from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo

app = Flask(__name__)

# Configure CORS to allow requests from specific origin
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for debugging

app.config["MONGO_URI"] = "mongodb+srv://admin_test:admin@cluster0.zybueoo.mongodb.net/blackrock?retryWrites=true&w=majority&appName=Cluster0"
mongo = PyMongo(app)

@app.route('/')
def home():
    return "Welcome to the Flask MongoDB app!"

@app.route('/add', methods=['POST'])
def add_user():
    data = request.json
    user = {
        "name": data.get("name"),
        "email": data.get("email"),
        "role": data.get("role")
    }
    result = mongo.db.users.insert_one(user)  # Replace with your collection name
    return jsonify({"message": "User added successfully", "user_id": str(result.inserted_id)})

@app.route('/users', methods=['GET'])
def get_users():
    users = list(mongo.users.find({}, {"_id": 0, "name": 1, "email": 1, "role": 1}))
    return jsonify(users)

if __name__ == '__main__':
    app.run(debug=True)
