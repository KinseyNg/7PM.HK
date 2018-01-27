class RemoveColumnFromBook < ActiveRecord::Migration
  def change
    remove_column :books, :avatar_content_type, :string
  end
end
