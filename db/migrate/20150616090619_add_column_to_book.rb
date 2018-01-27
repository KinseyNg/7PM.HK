class AddColumnToBook < ActiveRecord::Migration
  def change
    add_column :books, :image, :attachment
  end
end
