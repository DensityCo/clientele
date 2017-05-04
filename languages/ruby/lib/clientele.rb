require 'httparty'
require 'mustache'

class ClienteleResource
  attr_reader :parent

  def initialize(resources, parent)
    @resources = resources
    @parent = parent
  end

  def method_missing(name, *args)
    resource = @resources[name.to_sym]
    if resource[:method] && args.length > 0
      # If at a leaf, make a request
      params = args[0]
      @parent.make_request(resource, params)
    else
      # Otherwise, return another resource
      ClienteleResource.new(resource, @parent)
    end
  end
end

class ClienteleApi < ClienteleResource
  def initialize(configuration)
    super(configuration[:resources], self)
    @variables = configuration[:variables]
  end

  def configure
    yield(@variables)
  end

  def destache(value, params)
    if value.is_a? Hash
      output = {}
      value.each do |k, v|
        output[destache(k, params).to_sym] = destache(v, params)
      end
      output
    elsif value.is_a? Array
      value.map do |i|
        destache(i, params)
      end
    else
      Mustache.render(value.to_s, params)
    end
  end

  def make_request(resource, params)
    args = destache(resource, @variables.merge(params))
    HTTParty.send(args[:method].downcase.to_s, args[:url], args)
  end
end
