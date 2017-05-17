from main import ClienteleApi
import json

# Describe the api client:
configuration = {
    "variables": {},
    "resources": {
        "clientele": {
            "users": {
                "get": {
                    "method": "GET",
                    "url": "https://densityco.github.io/clientele/users/{{id}}"
                },
            },
        },
    },
};

# Create the api client:
api = ClienteleApi(**configuration)

# Now use it:
response = api.clientele.users.get(id="1")
print response.json()
