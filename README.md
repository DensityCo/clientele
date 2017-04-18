# Clientele

Clientele is an idea I had to build a configurable api client for Density services. Typically,
creating an api client requires a lot of boilerplate and one of the goals of this project is to move
most of that boilerplate into a configuration file passed to the package on start.

Currently, Clientele only supports javascript apis, and only works in the frontend (as it depends on
`fetch` existing). Even so, it has a reletively simple api:

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

## More advanced

Variables can be defined to help modularize the config, and can be overridden in the api call if
desired. This provides an easy way to set properties that are global to all requests (ie, the
hostname or an authorization token).

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

Also, clientele exposes a `config` function in the root that lets you override variables at
runtime:

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

Finally, the variable `token` is special. If set (and it isn't overriden in a resource), then the
header `Authentication: Bearer {{token}}` is added to the request. There's no reason you couldn't
override this manually though if you don't want to send a token in a specific request.

And that's it! It's simple on purpose, and clientele's only job is to provide a nice wrapper around
raw ajax calls. It makes no attempt to solve releated problems such as pagination. However, it's a
good starting point.

## The Future

What's super interesting too is with a common format like this "generating" other api clients
shouldn't be to big of a deal, so in the future, I envision:

```python
import clientele
api = clientele({ "resources": {...}, "variables": {} })
response = api.some_thing.another_thing.get(id=1)
print(response)
```

or:

```ruby
Api = Clientele.new({ "resources": {...}, "variables": {} })
response = Api::SomeThing::AnotherThing.get(:id => 1)
puts response
```
