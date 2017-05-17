# Clientele

Clientele is a multi-language, configurable api client. Typically,
creating an api client in any language requires lots of boilerplate --
clientele aims to exchange this with a tidy configuration file passed to the
package on start.

## Language Support
- [JavaScript](languages/javascript/) (no Node support, as `fetch` is required)
- [Python](languages/python/)
- [Ruby](languages/ruby/)
- (Coming Soon)
    - Swift
    - Golang
    - Node

## Example Usage
_Note: Example usage in javascript. Python & Ruby examples found in
language-specific READMEs._
```javascript
import clientele from './clientele';

// Describe the api client:
const configuration = {
  variables: {},
  resources: {
    foo: {
      bar: {
        get: {
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/posts/{{id}}"
        }
      }
    }
  }
};

// Create the api client:
const api = clientele(configuration);

// Now use it:
// (behind the scenes, this calls `GET https://jsonplaceholder.typicode.com/posts/1`)
api.foo.bar.get({id: '1'}).then(data => {
  console.log(data);
});
```

## Advanced Usage
### Config variables
Variables can be defined to help modularize the config, and can be overridden
in the api call if desired. This provides an easy way to set properties that
are global to all requests (for example, the hostname or an authorization
token).

```javascript
const configuration = {
  variables: {
    host: 'https://jsonplaceholder.typicode.com'
  },
  resources: {
    foo: {
      bar: {
        get: {
          method: "GET",
          url: "{{{host}}}/posts/{{id}}"
        }
      }
    }
  }
};

// Create the api client:
const api = clientele(configuration);

// Behind the scenes, this calls `GET https://jsonplaceholder.typicode.com/posts/1`
api.foo.bar.get({id: '1'}).then(data => {
  console.log(data);
});

// Behind the scenes, this calls `GET https://example.com/posts/1`
api.foo.bar.get({id: '1', host: 'https://example.com'}).then(data => {
  console.log(data);
});
```

### Runtime Config Override
Clientele exposes a `config` function in the root that lets you override
variables at runtime:

```javascript
const configuration = {
  variables: {
    host: 'https://jsonplaceholder.typicode.com'
  },
  resources: {
    foo: {
      bar: {
        get: {
          method: "GET",
          url: "{{{host}}}/posts/{{id}}"
        }
      }
    }
  }
};

// Create the api client
const api = clientele(configuration);

// Update variables.
api.config({host: 'https://example.com'});

// Behind the scenes, this calls `GET https://example.com/posts/1`
api.foo.bar.get({id: '1'}).then(data => {
  console.log(data);
});
```

### Tokens
The variable `token` is special. If set (and it isn't overriden in a resource),
then the header `Authentication: Bearer {{token}}` is added to the request.
This can beoverridden manually if you don't want to send a token in a specific
request.

### Monkey-patching for Flexibility

If there's functionality that clientele can't handle by default, it's easy to
monkey-patch things prior to exporting. For example,
combining two requests into a promise:

```javascript
var api = clientele(...);

api.runFooAndBar = function() {
  return Promise.all([
    api.foo(),
    api.bar(),
  ]);
}

export default api;
```

## The Future
### Generating API Clients
Due to clientele's common configuration format, the "generating" of APIs
through compilation is exciting and feasible. The beginnings of this can be
found in the [compiler](languages/compiler) directory, but it's not yet
production-ready.

### Lanuage Support
Swift, Golang, and Node are all coming soon.

### Pagination
Built-in support for paginated result sets is on the roadmap.
