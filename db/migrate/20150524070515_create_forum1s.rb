class CreateForum1s < ActiveRecord::Migration
  def change
    create_table :forum1s do |t|
      t.string :category
      t.integer :mode

      t.timestamps null: false
    end
  end
end
