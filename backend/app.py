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



@app.route('/stocks/<user_id>', methods=['GET'])
def get_user_stocks(user_id):
    stocks = mongo.db.stocks.find({'user_id': user_id})
    stocks_list = []
    for stock in stocks:
        stocks_list.append({
            'symbol': stock['symbol'],
            'units': stock['units']
        })
    return jsonify(stocks_list)



@app.route('/check_user', methods=['POST'])
def check_user():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    role = data.get('role')
    
    existing_user = mongo.db.users.find_one({"name": name, "email": email, "role": role})
    
    if existing_user:
        return jsonify({"exists": True, "message": "User already exists, logged in successfully!"})
    else:
        return jsonify({"exists": False})


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
        num_chunks = intervals_dict.get(interval, 30)  # Default to 30 if not found
        chunk_size = intervals_dict['1d']  # Base chunk size in days

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

    

stocks = {
    'AAPL': {'ESG_value': 75, 'type': 'Technology'},
    'RIL': {'ESG_value': 65, 'type': 'Energy'},
    'INFY': {'ESG_value': 80, 'type': 'Technology'},
    'HDB': {'ESG_value': 70, 'type': 'Financial'},
    'IBN': {'ESG_value': 68, 'type': 'Financial'},
    'ACN': {'ESG_value': 78, 'type': 'Technology'},
    'DNN': {'ESG_value': 60, 'type': 'Energy'},
    'FSV': {'ESG_value': 72, 'type': 'Real Estate'},
    'IFF': {'ESG_value': 74, 'type': 'Consumer Goods'},
    'LPG': {'ESG_value': 66, 'type': 'Energy'}
}

@app.route("/topten")
def get_top_ten():
    try:
        stock_data = []
        for symbol, info in stocks.items():
            stock = yf.Ticker(symbol)
            hist = stock.history(period='1d')  # Fetch today's data

            if hist.empty:
                continue

            current_price = hist['Close'].iloc[-1]
            open_price = hist['Open'].iloc[-1]
            profitable = current_price > open_price

            stock_info = {
                'company': symbol,
                'price': current_price,
                'p/l': 'profitable' if profitable else 'not profitable'
            }
            stock_data.append(stock_info)

        return jsonify(stock_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/buy', methods=['POST'])
def buy_stock():
    data = request.json
    print(f"Received data for buy: {data}")  # Add this line to log the data
    user_id = data.get('user_id')
    symbol = data.get('symbol')
    units = int(data.get('units', 0))
    
    # if not user_id or not symbol or units <= 0:
    #     return jsonify({'error': 'Invalid input'}), 400

    stock_entry = mongo.db.stocks.find_one({'user_id': user_id, 'symbol': symbol})
    
    if stock_entry:
        mongo.db.stocks.update_one(
            {'user_id': user_id, 'symbol': symbol},
            {'$inc': {'units': units}}
        )
    else:
        mongo.db.stocks.insert_one({
            'user_id': user_id,
            'symbol': symbol,
            'units': units
        })
    
    return jsonify({'message': 'Stock bought successfully'}), 200

@app.route('/sell', methods=['POST'])
def sell_stock():
    data = request.json
    print(f"Received data for sell: {data}")  # Add this line to log the data
    user_id = data.get('user_id')
    symbol = data.get('symbol')
    units = int(data.get('units', 0))
    
    if not user_id:
        return jsonify({'error': 'Invalid input'}), 400

    stock_entry = mongo.db.stocks.find_one({'user_id': user_id, 'symbol': symbol})

    if not stock_entry or stock_entry['units'] < units:
        return jsonify({'error': 'Not enough stocks to sell'}), 400

    mongo.db.stocks.update_one(
        {'user_id': user_id, 'symbol': symbol},
        {'$inc': {'units': -units}}
    )

    return jsonify({'message': 'Stock sold successfully'}), 200

    

if __name__ == '__main__':
    app.run(debug=True)