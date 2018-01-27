class AuthController < ApplicationController
  def login
    @email=params[:email]
    @password=params[:password]
    @check1=User.where(:email => @email).where(:password=>@password)
   #puts check1.to_yaml
 if @email&&@password
    if @check1.present?
     session[:siteid]=@check1.first.id
      if session[:path].present?
        redirect_to session[:path]
      else
        redirect_to '/'
      end

    else
      flash[:error]="電郵或密碼錯誤，請重試"
      redirect_to :back
    end
   end
  end
  def reg
    @tel=params[:tel]
    @password=params[:password]
    @password2=params[:password2]
    @email=params[:email]
    @name=params[:name]
    @displayname=params[:displayname]
    findemail=User.where(:email=>params[:email])
    finddisplayname=User.where(:name=>params[:displayname])

    if @displayname.empty?||@password.empty?||@password2.empty?||@email.empty?

    #  puts params
      flash[:error]="請填寫所有項目然後重新提交"
      redirect_to :back
    elsif @password!=@password2
      flash[:error]="兩次輸入的密碼不一樣，請重新輸入"
      redirect_to :back
    elsif findemail.present?
      flash[:error]="電郵已有人使用，請選擇另一個電郵"
      redirect_to :back
    elsif finddisplayname.present?
      flash[:error]="顯示名稱已有人使用，請選擇另一個名稱"
      redirect_to :back
    else
     @newuser=User.create(:tel=>@tel,:password=>@password,:email=>@email,:name=>@displayname)
     MsgShow("註冊成功","請使用剛才輸入的電郵與密碼登入","/login","登入網站","s")
    end




  end
  def emailconfirm
  end
  def logout
    session.delete(:siteid)
    redirect_to '/'
  end

  def forgotpassword
  end

  def userprofile
  end

  def userprofileupdate

  end

  def edit
    @user=User.find(session[:siteid])

  end

  def update

  end
  def editsubmit
    pass=params[:pass]
    newpass1=params[:newpass1]
    newpass2=params[:newpass2]
    findCurrent=User.where(:id=>session[:siteid],:password => pass)
    puts findCurrent.to_yaml
 begin
    if findCurrent.first.id.present?
      if newpass1==newpass2 && newpass2.length>5
        findCurrent.first.password=newpass2
        findCurrent.first.save
        flash[:error]="更改密碼成功"
        redirect_to :back
        return

      else
        flash[:error]="新密碼兩次輸入不一或密碼短於6位，請重試"
        redirect_to :back
        return
      end
    else

    end
  rescue
     flash[:error]="原密碼錯誤，請重試"
     redirect_to :back
     return
  end
  end
  end
