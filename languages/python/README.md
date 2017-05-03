# Clientele Python

This clientele wrapper will create a python api client given a clientele specification. Under the
hood, it uses python's excellent `requests` module to query the server according to the spec and
returns a `requests.Response` from each method.

Check out [example.py](example.py) for a demo.
