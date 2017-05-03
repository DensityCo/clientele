const argv = require('minimist')(process.argv.slice(2));
const generator = argv.generator ? require(argv.generator) : require('./generators/javascript');
const output = argv.output ? fs.createWriteStream(argv.output) : process.stdout;
const input = argv.input ? fs.createReadStream(argv.input) : process.stdin;

if (argv.help) {
  console.log(`${process.argv[1]} [--input config.json] [--output output.js] [--generator ./path/to/generator]`);
  console.log();
  console.log('Usage:');
  console.log(`* --input      Pass a configuration file as input for the client generator to consume. If not specified, read from stdin to fetch the configuration.`);
  console.log(`* --output     Output the generated client to this file. If not specified, output to stdout.`);
  console.log(`* --generator  Pass a custom generator to use when creating the client, this lets you generate clients in other languages.`);
  console.log();
  console.log('Example:');
  console.log(`$ cat config.json | ${process.argv[1]} > client.js`);
  console.log(`$ ${process.argv[1]} --input config.json --output client.js`);
  process.exit(0);
}

// Generate operations to perform to build the api client
const operations = [];
function generateOperationsForConfig(resources, lastKey=null) {
  for (let key in resources) {
    if (!resources[key]) { continue; }
    if (resources[key].method) {
      operations.unshift([
        generators.generateMethod,
        key,               // The name of the the leaf to create
        resources[key],    // The data in that key
        lastKey,           // The "level above"'s key.
      ]);
    } else {
      operations.unshift([
        generators.generateLevel,
        key,                                          // The name of the node to create.
        Object.keys(resources[key]),                  // An array of nodes / leafs within this node.
        Object.keys(resources[key]).map(i =>          // An array that indicates if an element is a leaf or node.
          resources[key][i].method ? 'leaf' : 'node'),
      ]);
      generateOperationsForConfig(resources[key], key);
    }
  }
}

module.exports = function compile({resources, variables}, topLevelIdentifier="root") {
  output.write(`${generators.generateRequestHandler()}\n`);

  generateOperationsForConfig(configuration.resources);
  operations.forEach(([action, ...args]) => output.write(`${action(...args)}\n`));

  // Generate the top level node.
  output.write(`${generators.generateLevel(
    topLevelIdentifier,
    Object.keys(configuration.resources),
    Object.keys(configuration.resources).map(i => i.method ? 'leaf' : 'node')
  )}\n`);

  // Export the top level node.
  output.write(`${generators.generatePublicExport(topLevelIdentifier)}\n`);
}


// Describe the api client:
const configuration = {
  variables: {},
  resources: {
    clientele: {
      users: {
        get: {
          method: "GET",
          url: "https://densityco.github.io/clientele/users/{{id}}"
        },
        list: {
          method: "GET",
          url: "https://densityco.github.io/clientele/users/{{id}}"
        },
        create: {
          method: "POST",
          url: "https://densityco.github.io/clientele/users/{{id}}"
        }
      }
    }
  },
};

if (require.main === module) {
  // Get configuration from the input stream...
  let data = "";
  input.on('data', chunk => { data += chunk.toString() });
  input.on('end', () => {
    // ... And act on it.
    module.exports(JSON.parse(data));
  });
}
