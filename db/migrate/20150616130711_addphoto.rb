class Addphoto < ActiveRecord::Migration
  def change
    add_attachment :books, :photo1
    add_attachment :books, :photo2
    add_attachment :books, :photo3
  end
end
##Tmp (Must use for photo upload)