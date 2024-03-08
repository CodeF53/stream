require 'active_support/core_ext/integer/time'

# Settings specified here will take precedence over those in config/application.rb.
Rails.application.configure do
  # improve performance by creating a static environment
  config.cache_classes = true # don't reload code between requests
  config.eager_load = true # load entire app into ram

  # reduce log levels for errors and extra info
  config.log_formatter = ::Logger::Formatter.new # use default log formatter for PID & timestamp
  config.consider_all_requests_local = false # disabled full error reports & enable caching
  config.active_support.report_deprecations = false # don't log any deprecations.
  config.log_level = :info # only generic logs that avoid personal info
  config.log_tags = [:request_id] # add request id to all log lines

  # ensure config/master.key exists
  config.require_master_key = true
end
# Rails.application.routes.default_url_options = { host: ??? }
