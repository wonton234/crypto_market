from flask import request, jsonify,Blueprint
from krakenApi import KrakenAPI
import os
from dotenv import load_dotenv

api_routes = Blueprint('api_routes',__name__)

load_dotenv()

api_keys_store = {
    "Me":
    {
        "api_key":os.getenv('FIRST_API_KEY'),
        "api_secret":os.getenv('FIRST_API_SECRET')
    },
    "Second":
    {
        "api_key":os.getenv('SECOND_API_KEY'),
        "api_secret":os.getenv('SECOND_SECRET')
    }
}
outer_keys = api_keys_store.keys()
print(outer_keys)
@api_routes.route('/api/clients',methods=['GET'])
def get_Clients():
    # return list of clients that are accessible
    return jsonify({
        'success': True,
        'data': list(api_keys_store.keys()) 
    })