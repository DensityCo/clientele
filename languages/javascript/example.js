const clientele = require('./index');
fetch = require('node-fetch');

// Describe the api client:
const configuration = {
  variables: {},
  resources: {
    clientele: {
      users: {
        get: {
          method: "GET",
          url: "https://densityco.github.io/clientele/users/{{id}}"
        }
      }
    }
  },
};

// Create the api client:
const api = clientele(configuration);

// Now use it:
api.clientele.users.get({id: '1'}).then(data => {
  console.log(data);
});
