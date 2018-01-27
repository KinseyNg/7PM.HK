Rails.application.routes.draw do
 ##Old book

  get 'oldbook/index'

  get 'oldbook/add'
  post 'oldbook/add' =>'oldbook#addnew'
  get 'oldbook/details'
  get '/oldbook/tel'
  get '/oldbook/editbook/:bid'=>'oldbook#editbook'
  post '/oldbook/editbooksubmit'=>'oldbook#editbooksubmit'
  get '/oldbook/finish'
  post '/oldbook/tel' =>'oldbook#updatetel'
  get "/oldbook/showdetails/:id" =>'oldbook#showdetails'
  post "/oldbook/showdetails/:id" =>'oldbook#submitdetailask'
  get '/oldbook/finish/:id' => 'oldbook#bookfinish'
  get '/oldbook/ask/' => 'oldbook#ask'
  post '/oldbook/askadd/'=>'oldbook#askadd'
  get '/oldbook/:type/:fid'=>'oldbook#sub'
  post '/oldbook/:type/'=>'oldbook#sub'
  get '/oldbook/:type/'=>'oldbook#sub'

  #get '/oldbook/lang/:fid'=>'oldbook#sub'
  ##Old_end
  #get 'msg/index'
  get "/msg" => 'msg#index'
  get 'msg/send'
  post '/msg/sending'=>'msg#sending'
  get 'msg/detail'

  get 'auth/login'
  post 'login' =>'auth#login'
  get 'auth/logout'

  get 'auth/forgotpassword'

  get 'auth/userprofile'
  get '/auth/edit'
get '/prompt' => 'msg#prompt'
post 'auth/edit'=>'auth#editsubmit'
  # get "f/showt/:fid" =>'forum#showtitle'

  #mount Bootsy::Engine => '/bootsy', as: 'bootsy'
  get 'home/index'

root 'forum#showforum'



  ####IG SHOP PATH
  get "/ig/purchase/:item_id"=>'igshop#purchase'

  get "/ig/firsttime" =>"igshop#firsttime"
  get "ig/index" =>'igshop#index'
  get "ig/create" =>'igshop#create'
  get "ig/callback" =>'igshop#callback'
  post "ig/firsttime"=>'igshop#create'
  get "ig/del" => 'igshop#del'
  get 'ig/:owner_name' => 'igshop#showShop'
  get 'ig/:owner_name/:item_id' => 'igshop#showItem'
  get 'ig/type/:type'=>  'igshop#index'
  get 'ig/product/:item_id'=>'igshow#showItem'
  post 'ig/product/:item_id'=>'igshop#purchase'

  ###IG SHOP END


  ##Forum start

  get "f/showf" =>'forum#showforum'
  get "f/gen" =>'forum#gen'
  post "f/gen" => 'forum#updategen'
  get "/f/search" => 'forum#search'
#rails generate bootsy:install
  get "f/showt/:fid" =>'forum#showtitle'
  post "f/showt/:fid" =>'forum#writetitle'
  get "f/showc/:tid" =>'forum#showcm'
  post "/f/showc/:tid" => 'forum#writecm'
  #get "/f/showcg/:tid" => 'forum#writecm'
  get "forum/" =>"forum#showforum"
  get "forum/showforum"
  get "forum/showtitle"
  get "forum/showcm"
  get "forum/writecm"
  get "forum/writetitle"
  get "forum/admin"
  ##Forum_end

  ##Auth
  get "/login" =>'auth#login'
  post "/reg" =>'auth#reg'

  ##End of Auth
##Msg

get "/msg/new" =>'msg#new'
  get "/msg/prompt" =>'msg#prompt'
get "/msg/details/:id"=>'msg#detail'
##Msg_End

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
