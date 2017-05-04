import requests
import json
import pystache

class NoSuchEndpointException(AttributeError): pass

# Given a nested data structure with embedded mustache tags, replace all staches with their
# contents in `config`
def destache(data, config):
    if type(data) is list:
        return [destache(i, config) for i in data]
    elif type(data) is dict:
        return dict(
            ((destache(k, config), destache(v, config)) for (k, v) in data.iteritems())
        )
    else:
        response = pystache.render(data, config)
        if len(response) and response != "False":
            return response
        else:
            return None

class ClienteleResource(object):
    def __init__(self, resources, api_container):
        self.resources = resources
        self.api_container = api_container

    def __getattr__(self, name):
        resource = self.resources.get(name)

        if type(resource) is dict and resource.get("method"):
            # "Leafs" are returned by value
            def route(**args):
                return self.api_container.request(resource, args)
            return route
        elif type(resource) is dict:
            # Nested api routes must be wrapped
            return ClienteleResource(resource, self.api_container)
        else:
            raise NoSuchEndpointException("The endpoint {} doesn't exist.".format(name))

class ClienteleApi(ClienteleResource):
    def __init__(self, resources, variables):
        super(ClienteleApi, self).__init__(resources, self)
        self._configuration = variables

    def config(self, **configuration):
        for key, value in configuration.iteritems():
            self._configuration[key] = value

    def request(self, resource, args):
        # Merge args and configuration in a way that anything in args overrides a value
        # in configuration
        configCopy = self._configuration.copy()
        args.update(configCopy)

        # replace mustaches in the resource with arguments
        resource = destache(resource, args)

        request_params = {
            "headers": resource.get("headers", {}),
            "params": resource.get("qs", {}),
        }

        # Send a body along with the request, if specified
        if resource.get("body"):
            request_params["body"] = json.dumps(resource["body"])
            request_params["headers"]["Content-Type"] = "application/json"

        # if a token was passed and there isn't already an autorization header in the request, add
        # it to the request.
        if not request_params["headers"].get("Authorization") and args.get("token"):
            request_params["headers"]["Authorization"] = "Bearer {}".format(args["token"])

        # TODO: a better way to use a custom request method?
        requests_method = getattr(requests, resource["method"].lower())
        return requests_method(resource["url"], **request_params)
