source 'https://rubygems.org'
ruby '3.2.2'

# basic ruby on rails functionality
gem 'bootsnap', require: false
gem 'puma', '~> 5.0'
gem 'rails', '~> 7.0.8'
gem 'sqlite3', '~> 1.4'
gem 'turbo-rails'

# js/css asset management & bundling
gem 'jsbundling-rails'
gem 'sprockets-rails'

# launching with procfile
gem 'foreman'

# the movie db (and a way to provide a key for it)
gem 'dotenv'
gem 'themoviedb'
# easier usage of data fetched from TMDB
gem 'hash_dot'

group :development do
  # linting
  gem 'rubocop', require: true
  gem 'rubocop-rails', require: true
  gem 'ruby-lsp', require: true
  gem 'ruby-lsp-rails', require: true

  # debugger, see https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug'
  gem 'web-console'
end
