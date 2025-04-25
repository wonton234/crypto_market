import time
import base64
import hashlib
import hmac
import urllib
import urllib.parse
import requests

class KrakenAPI:
    def init(self,api_key,api_secret):
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
    
    def get_account_balance(self):
        """
        Retrieve account balance from Kraken.

        :return: Account balance details
        """
        nonce = str(int(time.time()*1000))
        print("Nonce: ",nonce)
        uri_path = '0/private/Balance'

        data = {
            "nonce": nonce
        }

        return self.kraken_request(uri_path,data)