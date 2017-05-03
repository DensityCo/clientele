from main import ClienteleApi
import json

with open("../../client-js/specs/core-api.json") as c, open("../../client-js/specs/accounts-api.json") as a:
    core = ClienteleApi(**json.load(c))
    core.config(token="ses_AXNP6aZhZlTa9NKEouUgmZWSEtsGE7S02GnLgntEzua")

    accounts = ClienteleApi(**json.load(a))
    accounts.config(token="ses_AXNP6aZhZlTa9NKEouUgmZWSEtsGE7S02GnLgntEzua")

    print accounts.resources
