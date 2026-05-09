from flask import Flask, render_template, jsonify, request
import random
import sqlite3
import os
import time

app = Flask(__name__)

last_report_time = {}

def analyze_sentiment(text):
    text_lower = text.lower()
    unsafe_words = ["dark", "harassment", "unsafe", "creepy", "isolated", "scary", "no lights", "missing"]
    safe_words = ["safe", "lit", "crowded", "police", "good", "bright", "well"]
    
    unsafe_score = sum(1 for word in unsafe_words if word in text_lower)
    safe_score = sum(1 for word in safe_words if word in text_lower)
    
    if unsafe_score > 0 and unsafe_score >= safe_score:
        return 'unsafe'
    elif safe_score > 0:
        return 'safe'
    return 'moderate'

def init_db():
    conn = sqlite3.connect('reports.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS reports
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  type TEXT,
                  location TEXT,
                  severity TEXT,
                  description TEXT,
                  anonymous BOOLEAN)''')
    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect('reports.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/safety-data')
def safety_data():
    lat = float(request.args.get('lat', 17.3850))
    lon = float(request.args.get('lon', 78.4867))
    time_str = request.args.get('time', '12:00')
    
    try:
        hour = int(time_str.split(':')[0])
    except:
        hour = 12
        
    # Adjust thresholds based on granular hour
    if hour >= 19 or hour <= 5:
        safe_thresh = 0.20
        mod_thresh = 0.50
    elif hour >= 17:
        safe_thresh = 0.35
        mod_thresh = 0.70
    else:
        safe_thresh = 0.50
        mod_thresh = 0.85
        
    mock_comments = [
        "Street lights missing here, very dark.",
        "Safe even at 10 PM, lots of people.",
        "Feels isolated and creepy.",
        "Well lit and police patrolling.",
        "Harassment reported recently.",
        "Good area, crowded usually.",
        "No lights on this street.",
        "Very safe neighborhood."
    ]
        
    # Generate mock data around the coordinates (Hyderabad by default)
    data = []
    
    # Generate 50 points
    for _ in range(50):
        lat_offset = random.uniform(-0.06, 0.06)
        lon_offset = random.uniform(-0.06, 0.06)
        
        rand_val = random.random()
        # Pick a random comment and use AI sentiment to adjust score
        comment = random.choice(mock_comments)
        sentiment = analyze_sentiment(comment)
        
        # Blend sentiment with time-based random threshold
        rand_val = random.random()
        
        # Override random value if sentiment is strong
        if sentiment == 'unsafe':
            rand_val = 0.9 # force unsafe
        elif sentiment == 'safe':
            rand_val = 0.1 # force safe
            
        if rand_val < safe_thresh:
            level = 'safe'
            color = '#22c55e'
            desc = f"AI Sentiment: Safe. Review: '{comment}'"
        elif rand_val < mod_thresh:
            level = 'moderate'
            color = '#eab308'
            desc = f"AI Sentiment: Moderate. Review: '{comment}'"
        else:
            level = 'unsafe'
            color = '#ef4444'
            desc = f"AI Sentiment: Unsafe. Review: '{comment}'"
            
        data.append({
            'lat': lat + lat_offset,
            'lon': lon + lon_offset,
            'level': level,
            'color': color,
            'description': desc
        })
        
    return jsonify(data)

@app.route('/api/route-score')
def route_score():
    time_str = request.args.get('time', '12:00')
    try:
        hour = int(time_str.split(':')[0])
    except:
        hour = 12
        
    is_night = hour >= 19 or hour <= 5
    is_evening = hour >= 17 and hour < 19
    
    if is_night:
        base_score = random.randint(35, 60)
        time_factor = f"Negative (Nighttime {time_str} - exercise caution)"
        lighting_factor = random.choice(["Moderate - some dark patches", "Poor lighting reported"])
    elif is_evening:
        base_score = random.randint(60, 75)
        time_factor = f"Moderate (Evening {time_str} - reduced visibility)"
        lighting_factor = "Adequate along main roads"
    else:
        base_score = random.randint(75, 95)
        time_factor = f"Positive (Daytime {time_str})"
        lighting_factor = "N/A (Daytime)"
        
    reviews_factor = random.choice(["Highly rated by community", "Mixed recent reports", "Generally positive experiences"])
    
    return jsonify({
        "overall_score": base_score,
        "factors": {
            "time": time_factor,
            "lighting": lighting_factor,
            "reviews": reviews_factor
        }
    })

@app.route('/api/emergency-locations')
def emergency_locations():
    lat = float(request.args.get('lat', 17.3850))
    lon = float(request.args.get('lon', 78.4867))
    
    locations = []
    types = [
        {"type": "police", "name": "Local Police Station", "color": "#3b82f6", "icon": "shield"},
        {"type": "hospital", "name": "City Hospital", "color": "#ef4444", "icon": "activity"},
        {"type": "metro", "name": "Metro Station", "color": "#a855f7", "icon": "train"}
    ]
    
    # Generate 5-8 random emergency locations nearby
    for _ in range(random.randint(5, 8)):
        loc_type = random.choice(types)
        locations.append({
            'lat': lat + random.uniform(-0.05, 0.05),
            'lon': lon + random.uniform(-0.05, 0.05),
            'name': loc_type['name'],
            'type': loc_type['type'],
            'color': loc_type['color'],
            'icon': loc_type['icon']
        })
        
    return jsonify(locations)

@app.route('/api/report', methods=['POST'])
def submit_report():
    client_ip = request.remote_addr
    current_time = time.time()
    
    if client_ip in last_report_time:
        if current_time - last_report_time[client_ip] < 60:
            return jsonify({"status": "error", "message": "Please wait 1 minute before submitting another report. Fake report prevention is active."}), 429
            
    last_report_time[client_ip] = current_time
    
    data = request.get_json()
    incident_type = data.get('type')
    location = data.get('location')
    severity = data.get('severity')
    description = data.get('description')
    anonymous = data.get('anonymous', False)

    conn = get_db_connection()
    conn.execute('INSERT INTO reports (type, location, severity, description, anonymous) VALUES (?, ?, ?, ?, ?)',
                 (incident_type, location, severity, description, anonymous))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Report submitted successfully"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
