require './lib/clientele'

Thing = ClienteleApi.new({
  resources: {
    foo: {
      bar: {
        method: "GET",
        url: "https://densityco.github.io/clientele/users/{{id}}",
        headers: {
          "Test-Header": "{{my_header}}",
        }
      },
    },
  },
  variables: {
    hostname: "bla",
  },
})

# Specify custom configuration values
Thing.configure do |r|
  r[:my_header] = "foo"
end

# Use it.
puts Thing.foo.bar id: 1
