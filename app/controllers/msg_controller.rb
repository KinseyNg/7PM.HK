class MsgController < ApplicationController

  def index
    checkLogin()
    @readmy=Msg.where(:receiver => session[:siteid])
   # puts readmy.to_yaml
  end
  #
  def sending
    checkLogin()
    params[:main]
    begin
    if params[:username].present?
      findtargetid=User.where(:name =>  params[:username]).first.id
    elsif params[:userid].present?
      findtargetid=params[:userid]
    end
    rescue
      flash[:error]="無此用戶，請重試"
      redirect_to :back
      return
      end
 # if findtargetid.present?
   puts params[:cm_main]
    if params[:cm_main].present?&&findtargetid.present?
      newmsg=Msg.create(:sender=>session[:siteid],:receiver=>findtargetid,:main=>params[:cm_main])

      flash[:msg]="發送完成"
      MsgShow("短信已發出","請等待回答", request.original_url,"完成，返回上一頁","s")
      return
    end
    MsgShow("短信已發出","請等待回答", request.original_url,"完成，返回上一頁","s")
  #else

  #end
    end
  #
  #def detail
  #end
  def prompt


  end
  def new
    id=params[:id]

  findmsg=Msg.where(:id=>id,:receiver => id)
    
  end
  def detail
    checkLogin()
    @id=params[:id]

    @findmsg=Msg.find(@id)
    puts @findmsg.to_yaml
  end
end
