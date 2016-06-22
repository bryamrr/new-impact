Rails.application.routes.draw do
  get 'dashboard/*path' => 'application#index'

  get '/anfitrionas' => 'web#anfitrionas'
  get '/gracias' => 'web#gracias'
  post '/suscribir' => 'subscribe#create'

  namespace :api, defaults: { format: "json" } do
    namespace :v1 do
      resources :users, except: [:new, :edit]
      post 'users/login', to: 'users#login'
      post 'users/logout', to: 'users#logout'

      resources :reports, except: [:new, :edit]
      post 'approve/:id', to: 'reports#approve'

      resources :items, except: [:new, :edit]
      resources :vouchers, except: [:new, :edit]
      resources :companies, except: [:new, :edit]
      resources :activities, except: [:new, :edit]

      get 'data_reports/point', to: 'data_reports#point'
      get 'data_reports/expense', to: 'data_reports#expense'

      get 'data_filters/data_summary', to: 'data_filters#data_summary'
      post 'data_filters/summary', to: 'data_filters#summary'
    end
  end
end
