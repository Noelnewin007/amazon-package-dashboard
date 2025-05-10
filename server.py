import flask
print(flask.__version__)  # This will print the Flask version

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import random
import datetime
import os

# Create the Flask app and point static_folder to React's build folder
app = Flask(__name__, static_folder='pack-dashboard/build', static_url_path='/')
CORS(app)  # enables CORS for React to access this API

# Simulated data for testing
data = []

@app.route('/data')
def get_data():
    now = datetime.datetime.now().strftime("%H:%M")
    new_entry = {
        "time": now,
        "PACK_AFE": random.randint(170, 220),
        "PACK_SMALL": random.randint(150, 200),
        "PACK_MIX": random.randint(70, 95),
        "SMART_PACK": random.randint(430, 650)
    }

    alerts = []

    # Add messages and levels for alerts
    def add_alert(message, level):
        alerts.append({"message": message, "level": level})

    # Define threshold conditions for generating alerts
    if new_entry["PACK_AFE"] < 180:
        add_alert(f"PACK_AFE below threshold! (Current: {new_entry['PACK_AFE']})", "warning")
    if new_entry["PACK_SMALL"] < 160:
        add_alert(f"PACK_SMALL below threshold! (Current: {new_entry['PACK_SMALL']})", "warning")
    if new_entry["PACK_MIX"] < 80:
        add_alert(f"PACK_MIX below threshold! (Current: {new_entry['PACK_MIX']})", "warning")
    if new_entry["SMART_PACK"] < 450:
        add_alert(f"SMART_PACK CRITICAL LOW! (Current: {new_entry['SMART_PACK']})", "critical")
    elif new_entry["SMART_PACK"] < 500:
        add_alert(f"SMART_PACK below threshold! (Current: {new_entry['SMART_PACK']})", "warning")

    # Store new data and limit data to the latest 20 entries
    data.append(new_entry)
    if len(data) > 20:
        data.pop(0)

    return jsonify({"data": data, "alerts": alerts})


# Serve React frontend (make sure to serve the React build files from /build)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    # Get the port from the environment variable, or default to 5000
    port = int(os.environ.get("PORT", 5000))
    # Run the app in production-ready mode (change the host to allow external access if needed)
    app.run(debug=True, host='0.0.0.0', port=port)
