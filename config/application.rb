require_relative 'boot'

require 'rails'
require 'active_model/railtie'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_view/railtie'

Bundler.require(*Rails.groups)

class Application < Rails::Application
  config.load_defaults 7.0

  Tmdb::Api.key(ENV['TMDB_KEY'])
  Hash.use_dot_syntax = true
end
