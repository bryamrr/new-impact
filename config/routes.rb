Rails.application.routes.draw do
  namespace :api, defaults: { format: "json" } do
    namespace :v1 do
      resources :users, only: [:create, :update]
      post 'users/login', to: 'users#login'
      post 'users/logout', to: 'users#logout'

      resources :reports, except: [:new, :edit]
    end
  end
end
