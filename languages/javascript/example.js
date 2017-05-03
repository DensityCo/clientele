const clientele = require('./index');
fetch = require('node-fetch');

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
  },
};

// Create the api client:
const api = clientele(configuration);

// Now use it:
// (behind the scenes, this calls `GET https://jsonplaceholder.typicode.com/posts/1`)
api.foo.bar.get({id: '1'}).then(data => {
  console.log(data);
});
