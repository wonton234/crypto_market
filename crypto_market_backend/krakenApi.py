import time
import base64
import hashlib
import hmac
import urllib
import urllib.parse
import requests

class KrakenAPI:
    def __init__(self,api_key,api_secret):
        """
        initialize Kraken API client with API key and secret.

        :param api_key: Your Kraken API key
        :param api_secret: Your Kraken Api secret
        """
        self.api_key = api_key
        self.api_secret = api_secret
        self.api_url = "https://api.kraken.com"
    
    def get_kraken_signature(self,urlpath,data):
        """
        Generate Kraken API signature for authentication

        :param urlpath: API endpoint path
        :param data: Request payload data
        :return: signature digest
        """
        postdata = urllib.parse.urlencode(data)
        encoded=(str(data['nonce'])+ postdata).encode()
        message = urlpath.encode() + hashlib.sha256(encoded).digest()

        signature = hmac.new(base64.b64decode(self.api_secret), message, hashlib.sha512)
        sigdigest = base64.b64encode(signature.digest())
        return sigdigest.decode()
    
    def kraken_request(self, uri_path,data):
        """
        Make a private Kraken API request.

        :param uri_path: API endpoint path
        :param data: Request payload data
        :return: JSON response from the API
        """

        headers = {
            'API-Key': self.api_key,
            'API-Sign': self.get_kraken_signature(uri_path, data)
        }
        try:

            response = requests.post(
                self.api_url + uri_path,
                headers = headers,
                data = data
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error making requests: {e}")
            return None
    
    # formal and clean balances
    def format_balances(self,balances):

        """
        Clean up and format the kraken balance response.

        :param balances: Raw balance response from Kraken
        :return: Dictionary of non-zero, cleaned balances
        """

        result = {}
        for asset, amount in balances.get('result',{}).items():
            try:
                amount = float(amount)
            except (ValueError,TypeError):
                continue #skip if amount isn't a valid number
            if amount == 0:
                continue

            # Clean up asset names (Remove leading 'X' and 'Z' for common currencies)
            clean_asset = asset[1:] if asset.startswith(('X','Z')) else asset
            result[clean_asset] = amount
            
        return result
    

    def get_account_balance(self):
        """
        Retrieve account balance from Kraken.

        :return: Account balance details
        """
        nonce = str(int(time.time()*1000))
        uri_path = '/0/private/Balance'

        data = {
            "nonce": nonce
        }

        raw_response =  self.kraken_request(uri_path,data)
        if not raw_response:
            return {'error': 'Empty response from Kraken'}

        if 'error' in raw_response and raw_response['error']:
            return raw_response  # Pass along the Kraken error
    
        cleaned_result = self.format_balances(raw_response)
        return {'result': cleaned_result}
    
    def get_open_orders(self):
        """
        Retrieve open account orders

        :return: Open orders for the account
        """

        nonce = str(int(time.time()*1000))
        
        uri_path = '/0/private/OpenOrders'
        data = {
            "nonce": nonce
        }

        return self.kraken_request(uri_path,data)
    def add_order(self,ordertype,type,volume,pair,price=None):
        """
        Place order on kraken exchange

        :param ordertype: Order type (market, limit, etc.)
        :param type: buy or sell
        :param volume: Amount to buy/sell
        :param pair: Trading pair
        :param price: Price for limit orders (optional - required for limit orders, ignored for market orders)
        :return: API response from Kraken
        """
        
        nonce = str(int(time.time()*1000))

        uri_path = '/0/private/AddOrder'

        data = {
            "nonce":nonce,
            "ordertype":ordertype,
            "type":type,
            "volume": volume,
            "pair":pair
        }

        if price is not None:
            data["price"] = price

        return self.kraken_request(uri_path,data)



    
       