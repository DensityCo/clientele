require './lib/clientele'

resource = ClienteleApi.new({
  resources: {
    foo: {
      bar: {
        method: "GET",
        url: "https://densityco.github.io/clientele/users/{{id}}",
      },
    },
  },
  variables: {
    hostname: "bla",
  },
})

puts resource.foo.bar id: 1
