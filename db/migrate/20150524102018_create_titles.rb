class CreateTitles < ActiveRecord::Migration
  def change
    create_table :titles do |t|
      t.string :title_name
      t.integer :forum_id
      t.integer :user_id
      t.integer :cm_count
      t.string :create_ip
      t.integer :mode
      t.string :color

      t.timestamps null: false
    end
  end
end
