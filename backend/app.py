from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)

@app.route('/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    try:
        # Fetch the stock data using yfinance
        stock = yf.Ticker(symbol)
        data = stock.history(period='1d')

        if data.empty:
            return jsonify({'error': 'Invalid stock symbol or no data available'}), 400

        # Get the latest data
        latest_data = data.iloc[-1]

        return jsonify({
            'symbol': symbol,
            'timestamp': latest_data.name.strftime('%Y-%m-%d %H:%M:%S'),
            'open': latest_data['Open'],
            'high': latest_data['High'],
            'low': latest_data['Low'],
            'close': latest_data['Close'],
            'volume': latest_data['Volume']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
