require 'rubygems'
require 'net/https'
require 'open-uri'
class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session
 # protect_from_forgery with: :null_session
#  @currentusername=User.where(:id=>session[:siteid]).name
  def file_upload(filename)
    require 'fileutils'
    tmp = filename.tempfile
    file = File.join("public", filename.original_filename)
    FileUtils.cp tmp.path, file

        FileUtils.rm
  end

  def checkLogin
    if session[:siteid].nil?
      flash[:error]="請先登入，以使用本網站的功能"
      session[:path]=request.original_url
      puts session[:path]
      redirect_to '/login'
      return false
    else
      return true
    end

  end
  def sendMsg(message,receiver)
    msg=Msg.create(:sender=>session[:siteid],:main=>message,:receiver=>receiver)
 #   rec_email=User(receiver).first.email


  end

  def MsgShow(title,main,url,urltext,msgtype)
    flash[:title]=title
    flash[:main]=main
    flash[:url]=url
    flash[:msgtype]=msgtype
    flash[:urltext]=urltext
    redirect_to '/msg/prompt'
  end
end
