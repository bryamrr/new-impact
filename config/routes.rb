Rails.application.routes.draw do
  root 'application#index'
  get 'dashboard/*path' => 'application#index'

  namespace :api, defaults: { format: "json" } do
    namespace :v1 do
      resources :users, only: [:create, :update, :show]
      post 'users/login', to: 'users#login'
      post 'users/logout', to: 'users#logout'

      resources :reports, except: [:new, :edit]
      resources :items, except: [:new, :edit]
      resources :vouchers, except: [:new, :edit]
      resources :companies, except: [:new, :edit]

      get 'data_reports/point', to: 'data_reports#point'
      get 'data_reports/expense', to: 'data_reports#expense'

      get 'data_filters/data_summary', to: 'data_filters#data_summary'
      post 'data_filters/summary', to: 'data_filters#summary'
    end
  end
end
