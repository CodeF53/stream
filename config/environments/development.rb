require 'active_support/core_ext/integer/time'

# Settings specified here will take precedence over those in config/application.rb.
Rails.application.configure do
  # make hot reloading cleaner & more performant
  config.cache_classes = false # classes can hot reload
  config.eager_load = false # only load what we need when we need it

  # enable a small memory cache (cleared on reload) for debugging caching behavior
  config.cache_store = :memory_store, { size: 64_000_000 }

  # extra debug info
  config.consider_all_requests_local = true # no picky cors so you can use thunder client to test routes
  config.server_timing = true # time requests
  config.active_support.deprecation = :log # log use of depreciated methods
  config.active_support.disallowed_deprecation = :raise # error on using really depreciated stuff
  config.active_record.verbose_query_logs = true # trace which code triggers database queries

  # ensure config/master.key exists
  config.require_master_key = true

  # allow easier mobile testing through ngrok
  config.hosts << /[^.]*\.ngrok-free\.app/
end
Rails.application.routes.default_url_options = { host: 'localhost', port: 3000 }
