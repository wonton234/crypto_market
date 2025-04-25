from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from api_routes import api_routes


app = Flask(__name__)

# adjust for production!!!
CORS(app)

# Register the blueprint
app.register_blueprint(api_routes)

if __name__ =="__main__":
    app.run(debug=True,port=5000)