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
    print("Validating creds...")
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
    
    print(f"Credentials validated for {creds.get('key_name')}")
    

    # get account balance
    try:
        
        kraken = KrakenAPI(creds['api_key'],creds['api_secret'])
        print("KrakenAPI instance created")
        try:
            print("Attempting to get account balance...")
            balance_info= kraken.get_account_balance()
            print(f"Balance info response: {balance_info}")

            if not balance_info:
                print("No balance info returned")
                return jsonify({
                    'success': False,
                    'message': "Failed to retrieve balance: Empty response"
                }), 500
            
            if 'error' in balance_info and balance_info['error']:
                print(f"Kraken API returned errors: {balance_info['error']}")
                return jsonify({
                    'success': False,
                    'message': f"Kraken API errors: {', '.join(balance_info['error'])}"
                }), 500
            
            if 'result' not in balance_info:
                print("Response missing 'result' key")
                return jsonify({
                    'success': False,
                    'message': "Invalid response format from Kraken API"
                }), 500

            return jsonify({
                'success': True,
                'key_name': creds.get('key_name'),  
                'data': balance_info['result']
            })
        
        except Exception as e:
            print(f"Error getting account balance: {str(e)}")
            return jsonify({
                'success': False,
                'message': f"Error getting account balance: {str(e)}"
            }), 500
        
    except Exception as e:
        print(f"Error creating KrakenAPI instance: {str(e)}")
        return jsonify({
            'success': False,
            'message': f"Error creating KrakenAPI instance: {str(e)}"
        }), 500


# endpoint to get open orders
@api_routes.route('/api/get-open-orders',methods = ['POST'])
def get_open_orders():
    
    creds, error_resp = validate_and_get_creds()
    if error_resp:
        return error_resp
    
    kraken = KrakenAPI(creds['api_key'],creds['api_secret'])

    try:
        open_orders = kraken.get_open_orders()
        if not open_orders:
            return jsonify({
                'success': False,
                'message': "Failed to retrieve open orders"
            }), 500
        
        return jsonify({
            'success': True,
            'key_name': creds.get('key_name'),  
            'data': open_orders['result']
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# add order
@api_routes.route('/api/post-add-order',methods = ['POST'])
def add_order():

    # extract fields
    request_data = request.get_json()
    ordertype = request_data.get('ordertype')
    type_ = request_data.get('type')
    volume = request_data.get('volume')
    pair = request_data.get('pair')
    price = request_data.get('price')
    
    
    # Validate required fields

    if not all([ordertype, type_, volume, pair]):
        return jsonify({
            'success': False,
            'message': 'Missing one or more required fields: ordertype, type_, volume, pair'
        }), 400
    
    # Validate ordertype and type_
    valid_order_types = ['limit', 'market']
    valid_sides = ['buy', 'sell']
    if ordertype not in valid_order_types:
        return jsonify({
            'success': False,
            'message': f"Invalid ordertype. Expected one of: {valid_order_types}"
        }), 400
    
    if type_ not in valid_sides:
        return jsonify({
            'success': False,
            'message': f"Invalid type. Expected one of: {valid_sides}"
        }), 400
    

    # Validate volume
    try:
        volume = float(volume)
        if volume <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({
            'success': False,
            'message': 'Volume must be a positive number.'
        }), 400
    

    # if limit order, validate price
    if ordertype == 'limit':
        if price is None:
            return jsonify({
                'success': False,
                'message': 'Price is required for limit orders.'
            }), 400
        try:
            price = float(price)
            if price <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return jsonify({
                'success': False,
                'message': 'Price must be a positive number.'
            }), 400
    else:
        price = None
        
    # validate key name
    creds, error_resp = validate_and_get_creds()
    if error_resp:
        return error_resp
    
    kraken = KrakenAPI(creds['api_key'],creds['api_secret'])

    try:
        add_order_resp = kraken.add_order(ordertype,type_,volume,pair,price)
        if not add_order_resp:
            return jsonify({
                'success':False,
                'message': "Failed to post add order"
            })
        print(add_order_resp['result']['descr'])
        return jsonify({
            'success': True,
            'key_name':creds.get('key_name')
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


    
