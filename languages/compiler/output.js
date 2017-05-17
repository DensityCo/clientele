
const mustache = require('mustache');
const qs = require('qs');

// Given a nested data structure with embedded mustache tags, replace all staches with their
// contents in config
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
    if (response.length > 0) {
      return response;
    } else {
      return undefined;
    }
  }
}

// This function is called when a api call is to be made. It's passed data from the node and any
// configuration variables that apply to the function call.
function handleRequest(data, variables) {
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
    if (resp.status >= 200 && resp.status < 300) {
      return resp.json();
    } else {
      throw new Error(`Error ${resp.status} ${resp.statusText}: ${args.url} ${JSON.stringify(resp.body)}`);
    }
  });
}
  
const create = function(opts) {
    return handleRequest({"method":"POST","url":"https://densityco.github.io/clientele/users/{{id}}"}, opts);
  };
const list = function(opts) {
    return handleRequest({"method":"GET","url":"https://densityco.github.io/clientele/users/{{id}}"}, opts);
  };
const get = function(opts) {
    return handleRequest({"method":"GET","url":"https://densityco.github.io/clientele/users/{{id}}"}, opts);
  };
const users = {get, list, create};
const clientele = {users};
const root = {clientele};
module.exports = root;
