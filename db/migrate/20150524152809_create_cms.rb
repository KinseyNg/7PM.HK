class CreateCms < ActiveRecord::Migration
  def change
    create_table :cms do |t|
      t.integer :title_id
      t.integer :user_id
      t.string :cm_main
      t.string :ip
      t.integer :mode

      t.timestamps null: false
    end
  end
end
