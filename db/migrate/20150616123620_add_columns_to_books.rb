class AddColumnsToBooks < ActiveRecord::Migration
  def change
    add_column :books, :stu_f, :string
  end
end
