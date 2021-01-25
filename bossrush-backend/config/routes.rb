Rails.application.routes.draw do
  resources :battles
  resources :enemies
  resources :heros

  get '/high_scores', to: "heros#high_scores"
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
 