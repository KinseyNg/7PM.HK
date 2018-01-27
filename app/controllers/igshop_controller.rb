CALLBACK_URL = "http://dsehelper.hk:3000/ig/"
require 'json'
class IgshopController < ApplicationController
  layout "application"
  #layout "ig"

  def index
    if params[:code].present?
      response = Instagram.get_access_token(params[:code], :redirect_uri => CALLBACK_URL)
      session[:igaccess_token] = response.access_token
      redirect_to "/ig/firsttime"
      return
    end

      #@readIgCategory=IgCategory.all
      if params[:type].present?

      end
 #   @top=Product.find_all_by_top("1")

  end
  def search

  end

  def firsttime
    client = Instagram.client(:access_token => session[:igaccess_token])
    user = client.user
    #html = "<h1>#{user.username}'s recent media</h1>"
    @username=user.username
    @media=client.user_recent_media
    @shopname=user.full_name
    @shopdes=user.bio
    #html = "h1 #{user.username}'s recent media"
    #for media_item in client.user_recent_media
    #  html << "img src='#{media_item.images.thumbnail.url}'"
    #end
   #@media=html
  end
  def login

    Instagram.configure do |config|
      config.client_id = "0439dbd37b34483fbe89cf4adf6e0b60"
      config.client_secret = "a5c09be706cc4d2bb4636d64459973e7"
      # For secured endpoints only
      #config.client_ips = '<Comma separated list of IPs>'

    end
    redirect_to Instagram.authorize_url(:redirect_uri => CALLBACK_URL)
  end
   def create


      if params[:shopname].blank? ||  params[:shopdes].blank?
         flash[:error]="需要輸入所有資料"
        redirect_to :back
        return
      end


      client = Instagram.client(:access_token => session[:igaccess_token])

      findIg=IgShop.find_by_user_id(client.user.id)
      if findIg.present?
        flash[:error]="你已經建立過商店"
        redirect_to :back
        return
      end
      newShop=IgShop.new
    newShop.shop_title=params[:shopname]
    newShop.shop_des=params[:shopdes]
    newShop.profile_picture=client.user.profile_picture
      newShop.user_id=client.user.id
      newShop.owner_name=client.user.username
      newShop.follows=client.user.counts.follows
      newShop.media=client.user.counts.media
       newShop.followed_by=client.user.counts.followed_by
      newShop.save

      @media=client.user_recent_media
      @media.each_with_index do |n,index|
       # gNumber=0
       gNumber=n.likes
       gNumber=gNumber.to_json
       gNumber=gNumber.gsub!("count","count1")
    #    puts gNumber

       hash = JSON.parse gNumber

       number=hash.first.second
        item=newShop.products.create(:pic=>n.images.standard_resolution.url,:des=>n.caption.text,:likenum=>number,:link=>n.link)

      end


    #

      #newShop.items.create(:sh)
   end
  def view
  end

  def purchase
    @item_id=params[:item_id]
    @mode=params[:mode]
    if @mode=='msg'
        @title=params[:title]
        @main=params[:main]
        newmessage=Message.new
        newmessage.title=@title
        newmessage.main=@main
        newmessage.sender=session[:userid]
        #@item_id=params[:item_id]
        @shop=Product.find_by_id(@item_id)
        shop_id=@shop.ig_shop_id
        findSellId=IgShop.find_by_id(shop_id)
        newmessage.receiver=findSellId.site_id
        newmessage.save
      return
    end

    if @mode=='purchase'
      @item_id=params[:item_id]
      @remark=params[:remark]
      @payment_method=params[:payment_method]
      @tel=params[:tel]
      #@need_style=params[:need_style]
      readProduct=Product.find_by_id(@item_id)
      puts readProduct.to_yaml
      #newPurchases=Purchase.new
      newPurchases=readProduct.purchases.new
      newPurchases.ig_shop_id=readProduct.ig_shop_id
      newPurchases.user_id=session[:siteid]
      newPurchases.remark=@remark
      newPurchases.mode=1
      newPurchases.save

      return
    end


  end

  def message
  end

  def comment

  end
  def callback
    response = Instagram.get_access_token(params[:code], :redirect_uri => CALLBACK_URL)
    session[:igaccess_token] = response.access_token
    redirect_to "ig/view"
  end

  def del
    Product.destroy_all
    IgShop.destroy_all
    redirect_to "/ig/firsttime"
  end
  def showShop
    @name=params[:owner_name]
    @readInfo=IgShop.find_all_by_owner_name(@name)
    @shop_title=@readInfo.first.shop_title
    @shop_des=@readInfo.first.shop_des
    @profile_picture=@readInfo.first.profile_picture
    @followed_by=@readInfo.first.followed_by
    @follows=@readInfo.first.follows
    @media=@readInfo.first.media
    @findProduct=Product.find_all_by_ig_shop_id(@readInfo.first.id)

  end

  def showItem
    @item_id=params[:item_id]
    @name=params[:owner_name]
    @finish_buy=params[:finish_buy]
    @finish_msg=params[:finish_msg]

    @readItem=Product.find_by_id(@item_id)
    @readInfo=IgShop.find_all_by_id(@readItem.ig_shop_id)

    @readDetails=@readItem.des
    @pic=@readItem.pic
   # @show=readItem.to_yaml
    @readIgCategory=IgCategory.all
    @qa=IgQAndA.find_all_by_ig_shop_id(@readItem.ig_shop_id)
  end
  def igQAAdd
    @shop_id=params[:shop_id]
    @q=params[:q]
    @a=params[:a]
    @order=params[:order]


  end
end
