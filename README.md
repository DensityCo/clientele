<img src="https://cdn.rawgit.com/DensityCo/clientele/master/logo.svg" height="50" />

<br />

[![CircleCI](https://circleci.com/gh/DensityCo/clientele.svg?style=svg)](https://circleci.com/gh/DensityCo/clientele)
[![Dependency Status](https://david-dm.org/density/clientele.svg)](https://david-dm.org/density/clientele)
[![Package Version](https://img.shields.io/npm/v/@density/clientele.svg)](https://npmjs.com/@density/clientele)
![License](https://img.shields.io/badge/License-MIT-green.svg)

Clientele is a multi-language, configurable api client. Typically,
creating an api client in any language requires lots of boilerplate --
clientele aims to exchange this with a tidy configuration file passed to the
package on start.

## Language Support
- [JavaScript](languages/javascript/) (no official Node support, as `fetch` is required&ast;)
- [Python](languages/python/)
- [Ruby](languages/ruby/)
- (Coming Soon)
    - Swift
    - Golang
    - Node
    
_* You could [define fetch as a global](//npmjs.com/node-fetch) in node with `fetch = require('node-fetch')`, but it's not officially supported._

## Example Usage
_Note: Example usage in javascript. Python & Ruby examples found in language-specific READMEs._
```javascript
const clientele = require('@density/clientele');

// Describe the api client:
const configuration = {
  variables: {},
  resources: {
    users: {
      get: {
        method: 'GET',
        url: 'https://densityco.github.io/clientele/users/{{id}}'
      },
    },
  },
};

// Create the api client:
const api = clientele(configuration);

// Now use it:
api.users.get({id: '1'}).then(data => {
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
    host: 'https://densityco.github.io/clientele',
  },
  resources: {
    users: {
      get: {
        method: 'GET',
        url: '{{{host}}}/users/{{id}}'
      },
    },
  },
};

// Create the api client:
const api = clientele(configuration);

// Behind the scenes, this calls `GET https://densityco.github.io/clientele/users/1`
api.users.get({id: '1'}).then(data => {
  console.log(data);
});

// Behind the scenes, this calls `GET https://example.com/users/1`
api.users.get({id: '1', host: 'https://example.com'}).then(data => {
  console.log(data);
});
```

### Runtime Config Override
Clientele exposes a `config` function in the root that lets you override
variables at runtime:

```javascript
const configuration = {
  variables: {
    host: 'https://densityco.github.io/clientele',
  },
  resources: {
    users: {
      get: {
        method: 'GET',
        url: '{{{host}}}/posts/{{id}}',
      },
    },
  },
};

// Create the api client
const api = clientele(configuration);

// Update variables.
api.config({host: 'https://example.com'});

// Behind the scenes, this calls `GET https://example.com/users/1`
api.foo.bar.get({id: '1'}).then(data => {
  console.log(data);
});
```

### Error formatting
Clientele allows the user to pass in an `errorFormatter` argument that can preprocess a request
error before it is raised as an error in a specific call:

```javascript
const configuration = {
  variables: {
    host: 'https://densityco.github.io/clientele',
  },
  errorFormatter: response => response.text(), // Raise the body contents as text.
  resources: {
    users: {
      get: {
        method: 'GET',
        url: '{{{host}}}/posts/{{id}}',
      },
    },
  },
};

// Create the api client.
const api = clientele(configuration);

// Pretend this call raises an error. The error will be the body contents as text.
api.foo.bar.get({id: '1'}).catch(err => {
  // err is the body contents as text.
});
```


### Tokens
The variable `token` is special. If set (and it isn't overriden in a resource),
then the header `Authentication: Bearer {{token}}` is added to the request.
This can be overridden manually if you don't want to send a token in a specific
request.

### Monkey-patching for Flexibility

If there's functionality that clientele can't handle by default, it's easy to
monkey-patch things prior to exporting. For example, here's a method to return the sum of the data returned by `foo` and the data returned by `bar`:

```javascript
var api = clientele(...);

api.total = function() {
  return Promise.all([
    api.foo(),
    api.bar(),
  ]).then(([foo, bar]) => {
    return foo.data + bar.data;
  });
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
