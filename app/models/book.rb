class Book < ActiveRecord::Base
  has_one :cat_form
  has_attached_file :photo1, :styles => { :medium => "300x300>", :thumb => "100x100>" }, :default_url => "/images/:style/missing.jpg"
  validates_attachment_content_type :photo1, :content_type => /image/
  has_attached_file :photo2, :styles => { :medium => "300x300>", :thumb => "100x100>" }, :default_url => "/images/:style/missing.jpg"
  validates_attachment_content_type :photo2, :content_type => /image/
  has_attached_file :photo3, :styles => { :medium => "300x300>", :thumb => "100x100>" }, :default_url => "/images/:style/missing.jpg"
  validates_attachment_content_type :photo3, :content_type => /image/
  def self.search(search)
  if search
    self.where("title like ? OR main like ? and buyer=0", "%#{search}%" ,"%#{search}%")
  else
    self.all
  end
    end
end
