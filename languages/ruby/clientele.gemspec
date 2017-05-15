Gem::Specification.new do |spec|
  spec.name        = 'clientele'
  spec.version     = '0.0.1'
  spec.date        = '2017-04-07'
  spec.description = "A ruby client library for clientele, a system for generating client apis."
  spec.summary     = spec.description
  spec.authors     = ["Ryan Gaus"]
  spec.email       = "team+ruby@density.io"
  spec.files       = `git ls-files`.split($/)

  spec.add_dependency 'httparty', '~> 0.15.2'
  spec.add_dependency 'mustache', '~> 1.0.5'
  spec.add_development_dependency 'bundler', '~> 1.3'
  spec.add_development_dependency 'rake'
end
