Rails.application.routes.draw do
  namespace :api do
    post 'question' => 'question#create'
    get 'question/random' => 'question#random'
  end
  root 'home#index'
  get '/*path' => 'home#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
