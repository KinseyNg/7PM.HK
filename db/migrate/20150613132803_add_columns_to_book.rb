class AddColumnsToBook < ActiveRecord::Migration
  def change
    add_column :books, :public_year, :string
    add_column :books, :ip, :string
#    add_column :books, :view, :integer
  #  add_column :books, :ask, :integer
  end
end
