const mustache = require('mustache');
const qs = require('qs');

// Given a nested data structure with embedded mustache tags, replace all staches with their
// contents in `config`
function template(data, config) {
  if (Array.isArray(data)) {
    return data.map(i => template(i, config));
  } else if (data instanceof Object) {
    const obj = {};
    for (const i in data) {
      obj[template(i, config)] = template(data[i], config);
    }
    return obj;
  } else {
    return mustache.render(data.toString(), config);
  }
}

function exec(data, config) {
  // Set Authorization header by default
  data.headers = data.headers || {};
  data.headers.Authorization = data.headers.Authorization || 'Bearer {{token}}';

  // Parse staches!
  const args = template(data, config);

  if (typeof args !== 'string') {
    args.body = JSON.stringify(args.body);
  }

  // Make the request.
  return fetch(`${args.url}?${qs.stringify(args.qs || {})}`, args).then(resp => {
    if (resp.status >= 200 && resp.status < 300) {
      return resp.json();
    } else {
      throw new Error(`Error ${resp.status} ${resp.statusText}: ${args.url} ${JSON.stringify(resp.body)}`);
    }
  });
}



module.exports = function make({resources, variables}) {
  // Initially, our configuration starts with what was set in the config.
  let configuration = variables;

  // Traverse into a deeply-nested datastructure and convert leaf nodes into methods.
  function recurseThroughResources(resources, library) {
    for (const resource in resources) {
      if (resources[resource].method) { // If a request method was defined...
        // We're at a leaf, so create a function.
        library[resource] = function(args) {
          // Merge the global configuration and any args that were passed in.
          const combinedArgs = Object.assign({}, configuration, args);
          // Make the query.
          return exec(resources[resource], combinedArgs);
        };
      } else {
        // Just another node, decend further...
        library[resource] = recurseThroughResources(resources[resource], {});
      }
    }

    return library;
  }

  const library = {
    // A predefined function
    config(config) {
      for (const key in config) {
        configuration[key] = config[key];
      }
    }
  };

  return recurseThroughResources(resources, library);
}
