from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import yfinance as yf
from datetime import datetime, timedelta

app = Flask(__name__)

# Configure CORS to allow requests from specific origin
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for debugging

app.config["MONGO_URI"] = "mongodb+srv://admin_test:admin@cluster0.zybueoo.mongodb.net/blackrock?retryWrites=true&w=majority&appName=Cluster0"
mongo = PyMongo(app)

intervals_dict = {
    '1d': 1,
    '5d': 5,
    '1wk': 7,
    '1mo': 30,
    '3mo': 90,
    '6mo': 180,
    '1y': 365,
    '2y': 730,
    '5y': 1825,
    '10y': 3650,
    'ytd': 365,  # Year-to-date approximation
    'max': 10000  # A large number to fetch as much data as possible
}

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

@app.route('/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    interval = request.args.get('interval', default='1mo', type=str)
    
    if interval not in intervals_dict:
        return jsonify({'error': 'Invalid interval provided. Valid options are: ' + ', '.join(intervals_dict.keys())}), 400

    try:
        # Determine the number of chunks based on the interval
        num_chunks = intervals_dict.get(interval, 30)  # Default to 30 if not found
        chunk_size = intervals_dict['1d']  # Base chunk size in days

        # Fetch the stock data using yfinance
        stock = yf.Ticker(symbol)
        data = stock.history(period='max', interval='1d')  # Fetch daily data

        if data.empty:
            return jsonify({'error': 'Invalid stock symbol or no data available'}), 400

        # Split data into chunks
        data_points = []
        total_points = len(data)
        for i in range(0, total_points, chunk_size):
            chunk = data.iloc[i:i + chunk_size]
            if chunk.empty:
                continue
            chunk_data = []
            for index, row in chunk.iterrows():
                chunk_data.append({
                    'timestamp': index.strftime('%Y-%m-%d %H:%M:%S'),
                    'open': row['Open'],
                    'high': row['High'],
                    'low': row['Low'],
                    'close': row['Close'],
                    'volume': row['Volume']
                })
            data_points.append(chunk_data)
            if len(data_points) >= num_chunks:
                break

        return jsonify({
            'symbol': symbol,
            'interval': interval,
            'data_chunks': data_points
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
