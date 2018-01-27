class AddColToBooks < ActiveRecord::Migration
  def change
    add_column :books, :photo1, :attachment
    add_column :books, :photo2, :attachment
    add_column :books, :photo3, :attachment
  end
end
