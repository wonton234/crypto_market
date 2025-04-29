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

current_Exchanges = {
    "kraken":api_keys_store,
}

# get all clients 
@api_routes.route('/api/clients',methods=['GET'])
def get_Clients():
    # return list of clients that are accessible
    return jsonify({
        'success': True,
        'data': list(api_keys_store.keys()) 
    })

# check balance
@api_routes.route('/api/check-balance',methods = ['POST'])

def check_balance():
    # get key data from api_store
    data = request.json
    key_name = data.get('key_name')
   
    if not key_name:
        return jsonify({
            'success': False,
            'message': "Missing key name"
        }),400
    if key_name not in api_keys_store:
        return jsonify({
            'success': False,
            'message': f'Key "{key_name}" not found'
        }),404
    
    key_data = api_keys_store[key_name]
    
    kraken = KrakenAPI(key_data['api_key'],key_data['api_secret'])

    # get account balance
    try:
        balance_info= kraken.get_account_balance()
        if 'error' in balance_info and balance_info['error']:
            return jsonify({
            'success': False,
            'message': str(balance_info['error'])
            }),400
        # clean info from extra letters
        cleaned_info = kraken.format_balances(balance_info)
       
        if 'error' in cleaned_info:
            return jsonify({
                'success': False,
                'message': str(balance_info['error'])
            })
        
        return jsonify({
            'success': True,
            'key_name': key_name,
            'data':cleaned_info
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }),500