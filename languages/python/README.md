# Clientele Python

A python adapter for clientele.

```python
# thing.py
from clientele import ClienteleApi

configuration = {
    "resources": {
        "users": {
            "get": {
                "method": "GET",
                "url": "{{{hostname}}}/users/{{id}}",
            },
        },
    },
    "variables": {
        "hostname": "https://densityco.github.io/clientele",
    },
}

Thing = ClienteleApi(**configuration)

# example.py
from example import Thing

# If you'd like to override variables at runtime, you can with `config`:
Thing.config(
  hostname="https://densityco.github.io/clientele",
)

# Use it.
print Thing.users.get(id=1)
```
