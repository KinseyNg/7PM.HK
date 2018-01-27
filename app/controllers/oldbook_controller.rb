class OldbookController < ApplicationController

  def index

  @from=CatForm.all

  end

  def addnew
    if params[:title].nil?||params[:stu_f].nil?||params[:photo1].nil?
      flash[:error]="請填寫必要的項目"
      redirect_to :back
      return
    end
    book=Book.new(:location=>params[:location],:price=>params[:price],:public_year=>params[:public_years],:main=>params[:des],:status=>params[:status],:title=>params[:title],:stu_f=>params[:stu_f],:seller=>session[:siteid],:sold=>"unsold")
    book.photo1=params[:photo1]
    book.photo2=params[:photo2]
    book.photo3=params[:photo3]
    book.save!
    #MsgShow(title,main,url,urltext,msgtype)
    MsgShow("發怖完成","你可以按以下連結查看你的書本","/oldbook/showdetails/"+book.id.to_s,"查看","s")
  end

  def details
  end

  def sub
    @type=params[:type]
    @id=params[:fid]

    if @type=="f"
        @info=CatForm.where(:id=>@id)
        @allcat=CatForm.all
      #  @book=Book.where(:stu_f=>@id).page(params[:page])
      @book=Book.where("stu_f = ? AND( sold = ? OR sold = ?)", @id, "unsold","ask").order("created_at DESC").page(params[:page])
      puts @book.to_yaml
    elsif @type=="s"
      @book=Book.search(@id).order("created_at DESC").page(params[:page])
    end
  end
  def add
    checkLogin()
    @booklist=CatForm.all

  end

  def showdetails
    @id=params[:id]

    @bookinfo=Book.where(:id=>@id).first
    begin
    @tel=User.where(:id=>session[:siteid]).first.tel
    rescue
      @tel=""
     
      end
    if @tel.nil?
      render 'tel'
      return
    end
    @seller=User.where(:id=>@bookinfo.seller).name

    @sellerid=User.where(:id=>@bookinfo.seller)
  end
  def submitdetailask
    checkLogin()
    @main=params[:main]
    @sellerid=params[:sellerid]
    sendMsg(@main, @sellerid)
    MsgShow("短信已發出","請等待賣家回答", request.original_url,"完成，返回上一頁","s")
  end


  def updatetel

    @tel=params[:tel]

    if(@tel.nil?)
      flash[:error]="請輸入電話再提交"

      redirect_to :back
      return
    elsif(!((@tel.split(//).first=='2')||(@tel.split(//).first=='8')||(@tel.split(//).first=='6')||(@tel.split(//).first=='9')||(@tel.split(//).first=='5')||(@tel.split(//).first=='3')))
      flash[:error]="請輸入有效香港電話號碼"

      redirect_to :back
return
    elsif(!(@tel.length==8))
      puts @tel.length
      flash[:error]="請輸入有效香港電話號碼"
      redirect_to :back
    return
      end
    user=User.find(session[:siteid])
    user.tel=tel
    user.save
    redirect_to "/oldbook/index"
  end


  def editbook

    @book=Book.where(:id=>params[:bid])
    @booklist=CatForm.all

  end

  def editbooksubmit
    checkLogin()
    if params[:title].nil?||params[:stu_f].nil?
      flash[:error]="請填寫必要的項目"
      redirect_to :back
      return
    end
    #book=Book.new(:location=>params[:location],:price=>params[:price],:public_year=>params[:public_years],:main=>params[:des],:status=>params[:status],:title=>params[:title],:stu_f=>params[:stu_f],:seller=>session[:siteid])
    book=Book.find_by_id(params[:bid])
    book.update(:location=>params[:location],:price=>params[:price],:public_year=>params[:public_years],:main=>params[:des],:status=>params[:status],:title=>params[:title],:stu_f=>params[:stu_f],:seller=>session[:siteid])
   if params[:photo1].present?
      book.photo1=params[:photo1]
    end
   if params[:photo2].present?
     book.photo2=params[:photo2]
   end
   if params[:photo3].present?
     book.photo3=params[:photo3]
   end

    book.save!
    redirect_to '/oldbook/showdetails/'+params[:bid].to_s
  end

  def bookfinish
    book=Book.where(:id=>params[:id]).first
    book.buyer=1
    book.save
    MsgShow("文易已確定","感謝你使用本系統", request.original_url,"完成，返回上一頁","s")
  end

  def ask
    checkLogin()
    @booklist=CatForm.all
  end

  def askadd
    if params[:title].nil?||params[:stu_f].nil?
      flash[:error]="請填寫必要的項目"
      redirect_to :back
      return
    end
    book=Book.new(:location=>params[:location],:price=>params[:price],:public_year=>params[:public_years],:main=>params[:des],:status=>params[:status],:title=>params[:title],:stu_f=>params[:stu_f],:seller=>session[:siteid],:sold=>"ask")

    book.save!
    #MsgShow(title,main,url,urltext,msgtype)
    #MsgShow("發怖完成","你可以按以下連結查看你的請求","url","","s")
    MsgShow("發怖完成","你可以按以下連結查看你的請求","/oldbook/showdetails/"+book.id.to_s,"查看","s")
  end
private

# Use strong_parameters for attribute whitelisting
# Be sure to update your create() and update() controller methods.

  def user_params
    params.require(:user).permit(:avatar)
  end


end
