# Clientele Ruby

A ruby adapter for clientele.

```ruby
# thing.rb
require 'clientele-api'

Thing = ClienteleApi.new({
  resources: {
    users: {
      get: {
        method: "GET",
        url: "{{{hostname}}}/users/{{id}}",
      },
    },
  },
  variables: {
    hostname: "https://densityco.github.io/clientele",
  },
})

# example.rb
require './thing'

# If you'd like to override variables at runtime, you can in the `configure` block:
Thing.configure do |r|
  r[:hostname] = "https://densityco.github.io"
end

# Use it.
puts Thing.users.get(id: 1)
```
