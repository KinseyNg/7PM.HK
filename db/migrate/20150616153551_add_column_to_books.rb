class AddColumnToBooks < ActiveRecord::Migration
  def change
    add_column :books, :location, :string
    add_column :books, :sold, :string
  end
end
