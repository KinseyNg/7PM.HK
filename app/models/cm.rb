class Cm < ActiveRecord::Base
    has_one :title
    has_attached_file :photo1, :styles => { :medium => "300x300>", :thumb => "100x100>" }#, :default_url => "/images/:style/missing.jpg"
    validates_attachment_content_type :photo1, :content_type => /image/
end
