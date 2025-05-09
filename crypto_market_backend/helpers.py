from flask import jsonify

def check_key_name(key_name,keys_store):
    """
    Validate that `key_name` is present and exists in keys_store.
    Returns (is_ok, data_or_response, http_status)

    is_ok == True   → data_or_response is the (key, secret) dict
    is_ok == False  → data_or_response is a Flask response and http_status is the code
    """
    if not key_name:
        return False, jsonify({
            'success': False,
            'message': 'Missing key name'
        }), 400

    if key_name not in keys_store:
        return False, jsonify({
            'success': False,
            'message': f'Key "{key_name}" not found'
        }), 404
    
    # Ok -> return the (api_key, api_secret) payLoad so caller can use it
    return True,keys_store[key_name],200