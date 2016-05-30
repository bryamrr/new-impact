Rails.application.routes.draw do
  namespace :api, defaults: { format: "json" } do
    namespace :v1 do
      resources :users, only: [:create, :update]
      post 'users/login', to: 'users#login'
      post 'users/logout', to: 'users#logout'

      resources :reports, except: [:new, :edit]
      resources :items, except: [:new, :edit]
      resources :vouchers, except: [:new, :edit]
      resources :companies, except: [:new, :edit]

      get 'data_reports/point', to: 'data_reports#point'
      get 'data_reports/expense', to: 'data_reports#expense'
    end
  end
end
