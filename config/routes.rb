Rails.application.routes.draw do
  get '/:type/:id(/:s/:e)', to: 'stream#index', constraints: { type: /(movie|show)/ }, as: 'media'

  root 'home#index'
end
