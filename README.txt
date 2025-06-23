# Kraken Multi-Account Trader

A React app that allows users to seamlessly switch between multiple Kraken accounts and trade on any selected account with just a click.

## Overview

This app is designed for users who manage multiple Kraken accounts and want a streamlined interface to:

- Quickly jump between their Kraken accounts  
- Execute trades on any selected account instantly

The app handles authentication and user data through environment variables (`.env` file), making it ideal for limited, secure usage by specific users rather than public distribution.

## Features

- Multiple account management: Switch between Kraken accounts effortlessly  
- One-click trading: Send trade orders on the selected account without re-authentication  
- Simple, clean React UI for fast navigation

## Getting Started

1. Create a `.env` file in the root directory with your user-specific Kraken API credentials. Example:


REACT_APP_KRAKEN_API_KEY_1=your_api_key_1
REACT_APP_KRAKEN_API_SECRET_1=your_api_secret_1
REACT_APP_KRAKEN_API_KEY_2=your_api_key_2
REACT_APP_KRAKEN_API_SECRET_2=your_api_secret_2


2. In the backend file `api_routes.py`, parse the API keys and secrets from the environment variables into the `api_keys_store` dictionary. Example:

```python
import os

api_keys_store = {
    "Me": {
        "api_key": os.getenv('REACT_APP_KRAKEN_API_KEY_1'),
        "api_secret": os.getenv('REACT_APP_KRAKEN_API_SECRET_1')
    },
    "Second": {
        "api_key": os.getenv('REACT_APP_KRAKEN_API_KEY_2'),
        "api_secret": os.getenv('REACT_APP_KRAKEN_API_SECRET_2')
    }
}


3: install the dependencies

in the frontend folder:
    npm install

in the backend:
    pip install flask python-dotenv requests flask_cors

### Prerequisites

- Node.js and npm installed
- Kraken API keys for each user account
