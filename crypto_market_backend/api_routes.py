from flask import request, jsonify,Blueprint
from krakenApi import KrakenAPI
import os
from dotenv import load_dotenv
from helpers import check_key_name

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


# ---------- shared check ----------

def validate_and_get_creds():
    """
    Wrapper to keep routes clean:
    reads key_name from request.json and returns either
        (creds_dict, None) or (None, flask_response)
    """

    data  = request.get_json(silent=True) or {}
    key_name = data.get("key_name")
    ok,payload,status = check_key_name(key_name, api_keys_store)
    if not ok:
        return None, (payload,status)
    return payload,None

# ----------------------------------


# get all clients
# :return: list of clients that are accessible 
@api_routes.route('/api/clients',methods=['GET'])
def get_Clients():
    # return list of clients that are accessible
    return jsonify({'success': True,'data': list(api_keys_store.keys())})

# check balance
@api_routes.route('/api/check-balance',methods = ['POST'])
def check_balance():
    creds, error_resp = validate_and_get_creds()
    if error_resp:
        return error_resp
    
    
    kraken = KrakenAPI(creds['api_key'],creds['api_secret'])

    # get account balance
    try:
        balance_info= kraken.get_account_balance()
        if not balance_info:
            return jsonify({
                'success': False,
                'message': "Failed to retrieve balance."
            }), 500

        
        return jsonify({
            'success': True,
            'key_name': creds.get('key_name'),  # you may need to pass this in validate_and_get_creds()
            'data': balance_info['result']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
    
@api_routes.route('/api/get-open-orders',methods = ['POST'])
def get_open_orders():
    data = request.json
    key_name = data.get('key_name')



    
