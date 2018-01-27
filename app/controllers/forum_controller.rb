class ForumController < ApplicationController
 # private
 # include Bootsy::Container
  def showforum
  #  @showtitle=Title.find_all_by_mode(1)
  #  @forum = Forum.all
  #  puts "Output"
     @showforum=Forum.all
 #   puts @showforum

   # @showforum=Forum.find(1)
    # @recentcm=Cm.uniq

  end
  def index

  end
  def showtitle
    @fid= params[:fid]
    if session[:siteid].present?
    @checksex=User.find(session[:siteid])
    #puts @checksex.gender+" || test"

    if @checksex.gender.blank? and (@fid.to_i==5 or @fid.to_i==6)
      redirect_to '/f/gen'
      return
    end
    if @checksex.gender=="m"&&@fid.to_i==5
      MsgShow("你的帳戶不能查看","","/","回主頁","e")
      return
    end
    if @checksex.gender=="f"&&@fid.to_i==6
      MsgShow("你的帳戶不能查看","","/","回主頁","e")
      return
    end
end
   @forumname=Forum.find_by_id(@fid)

   @showtitle=Title.where(forum_id:@fid).order("updated_at DESC").page(params[:page])

  end

  def showcm
    @tid=params[:tid]
    begin
    usergender=User.find(session[:siteid]).gender
    fid=Title.find(@tid).forum_id
    if usergender =="m" && fid==5
      redirect_to '/'
      return
    end
    if usergender =="f" && fid==6
      redirect_to '/'
      return
    end
    rescue
      fid=Title.find(@tid).forum_id
     if session[:siteid].nil? && (fid==6||fid==5)
       redirect_to '/login'
       return
     end
    end
    @showtitle=Title.where(id:@tid)
    @showcm=Cm.where(title_id:@tid).page(params[:page])
    #@showcm= Kaminari.paginate_array(@showcm1).page(1).per(10)
  end

  def writecm

    @cm_main=params[:cm_main]
    @tid=params[:tid]
    update=Title.find_by_id(@tid)
    update.cm_count=update.cm_count+1
    update.save
    if params[:an_user].present?
      newCM=Cm.new(:title_id=>@tid,:user_id=>session[:siteid],:cm_main=>params[:cm_main],:mode=>1,:ip=>request.remote_ip,:an_user=>params[:an_user],:user_id=>'99999999')

    else
      newCM=Cm.new(:title_id=>@tid,:user_id=>session[:siteid],:cm_main=>params[:cm_main],:mode=>1,:ip=>request.remote_ip)
      newCM.photo1=params[:photo1]
    end

    newCM.save

    flash[:success]="已送出"

     redirect_to :back

    return
   #   end
  end

  def writetitle
    check=checkLogin()
    if check==true
    @title_name=params[:title_name]
    @cm_main=params[:cm_main]
    @forum_id=params[:fid]
    siteid=session[:siteid]
    newTitle=Title.create(:title_name=>@title_name,:user_id=>siteid,:cm_count=>1,:mode=>1,:forum_id=>@forum_id)

    newCM=Cm.create(:title_id=>newTitle.id,:user_id=>siteid,:cm_main=>@cm_main,:mode=>1)
    if newCM.user_id.nil?||newTitle.user_id.nil?
      newCM.user_id=siteid
      newTitle.user_id=siteid
      newTitle.save!
      newCM.save!
    end
    begin
      redirect_to '/f/showt/'+newTitle.forum_id.to_s
    rescue

    end
      end
  end

  def admin
  end
  def readNow
    chatroomnum=params[:chatroomnum]

    query = "SELECT name,msg_main FROM chatmains,users WHERE users.id=user_id AND chatroom_id="+chatroomnum
    results = ActiveRecord::Base.connection.execute(query, :skip_logging)
    selfCheck=ChatOnline.find_by_user_id_and_chatroom_id(session[:siteid],chatroomnum)
    @results1=results
    if selfCheck.blank?
      writeInList=ChatOnline.create(:chatroom_id=>chatroomnum,:user_id=>session[:siteid])

    end
    selfCheck.updated_at=DateTime.now
    selfCheck.save

    queryA = "SELECT name FROM chat_onlines,users WHERE users.id=user_id AND chatroom_id="+chatroomnum
    resultsA = ActiveRecord::Base.connection.execute(queryA, :skip_logging)

    readOnlineList=ChatOnline.find_all_by_chatroom_id(chatroomnum)
    readOnlineList.each do |n|
      puts n.updated_at.to_time
      puts DateTime.now.utc.to_time
      #Remark for checking time in future
      d=(DateTime.now.utc.to_time - n.updated_at.to_time).to_i.abs
      puts d
      if d>300
        n.delete

      end
    end

    #checkAllPeople
    #main=Chatmain.includes(:user).where("users.id = chatmains.user_id")
    #.where(:chatmains => {:chatroom_id => chatroomnum})
  #  render :json => results,
    respond_to do |format|
      format.json  { render :json => {:message => results,
                                      :list => resultsA }}
      format.html { render :'chat/chatFrame',:layout => false}
    end
  end
  def writeChat
    chatroomnum=params[:chatroomnum]
    message=params[:message]
    addMessage=Chatmain.create(:chatroom_id=>chatroomnum,:user_id=>session[:siteid],:msg_main=>message)
    redirect_to :back
  end

  def updategen

    @gen=params[:gender]
    #if(@gen.to_s!="m"||@gen.to_s!="f")
    #  redirect_to :back
    #  return
    #end

    currentuser=User.find(session[:siteid])
    currentuser.gender=@gen
    currentuser.save
    redirect_to "/f/showf"
  end

  def search
    @search=params[:fid]
    @showtitle=Title.where("title_name like ? and forum_id not in (5,6)", "%#{@search}%")

  end
end
