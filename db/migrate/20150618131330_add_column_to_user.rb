class AddColumnToUser < ActiveRecord::Migration
  def change
    add_column :users, :speak_count, :integer
  end
end
