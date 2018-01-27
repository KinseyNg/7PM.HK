class AddColumnToCm < ActiveRecord::Migration
  def change
    add_attachment :cms, :photo1

    add_column :cms, :an_user, :string
  end
end
