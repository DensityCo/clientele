const mustache = require('mustache');
const qs = require('qs');

// Given a nested data structure with embedded mustache tags, replace all staches with their
// contents in `config`
function template(data, config) {
  if (Array.isArray(data)) {
    return data.map(i => template(i, config));
  } else if (data instanceof Object) {
    let obj = {};
    for (let i in data) {
      obj[template(i, config)] = template(data[i], config);
    }
    return obj;
  } else {
    const response = mustache.render(data.toString(), config);
    if (!isNaN(parseFloat(response, 10))) { /* float values */
      return parseFloat(response, 10);
    } else if (!isNaN(parseInt(response, 10))) { /* int values */
      return parseInt(response, 10);
    } else if (response.length === 0) { /* empty values */
      return undefined;
    } else {
      return response;
    }
  }
}

// This function is called when a api call is to be made. It's passed data from the node and any
// configuration variables that apply to the function call.
function exec(data, variables, options) {
  // Set Authorization header by default
  data.headers = data.headers || {};
  data.headers.Authorization = data.headers.Authorization || 'Bearer {{token}}';

  // Parse staches!
  const args = template(data, variables);

  if (typeof args !== 'string') {
    args.body = JSON.stringify(args.body);
  }

  // Assemble a url.
  let url = args.url;
  if (args.qs && Object.keys(args.qs).length > 0) {
    url += `?${qs.stringify(args.qs || {})}`
  }

  // Make the request.
  return fetch(url, args).then(function (resp) {
    if (resp.ok) {
      // Make a clone of the response so that the body can be parsed twice if required.
      const respClone = resp.clone();

      // Try to parse the body as json, but if that fails, fall back to plain text.
      return respClone.json().catch(() => {
        return resp.text();
      });
    } else {

      // If an error formatting function was specified, pass the response in to get the error to
      // throw. Wrap in `Promise.all` so that even if the function doesn't return a promise, it'll
      // act like it did.
      if (options.errorFormatter) {
        return Promise.all([options.errorFormatter(resp)]).then(([error]) => Promise.reject(error));
      } else {
        // Reject the response on error
        return Promise.reject(resp);
      }
    }
  });
}



module.exports = function make(options) {
  // Initially, our configuration starts with what was set in the config.
  const configuration = options.variables;

  // Traverse into a deeply-nested datastructure and convert leaf nodes into methods.
  function recurseThroughResources(resources, library) {
    for (let resource in resources) {
      if (resources[resource].method) { // If a request method was defined...
        (function(resource) {
          // We're at a leaf, so create a function.
          library[resource] = function(args) {
            // Merge the global configuration and any args that were passed in.
            const combinedArgs = Object.assign({}, configuration, args);
            // Make the query.
            return exec(resources[resource], combinedArgs, options);
          };

          // Add the description to the fucntion. FIXME: is this weird?
          library[resource].source = resources[resource];
        })(resource);
      } else {
        // Just another node, decend further...
        library[resource] = recurseThroughResources(resources[resource], {});
      }
    }

    return library;
  }

  const library = {
    // A predefined function to adjust the configuration.
    config: config => {
      if (config) {
        for (let key in config) {
          configuration[key] = config[key];
        }
      } else {
        return configuration;
      }
    }
  };

  return recurseThroughResources(options.resources, library);
}
