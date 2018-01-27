class CreateForums < ActiveRecord::Migration
  def change
    create_table :forums do |t|
      t.string :category
      t.integer :mode

      t.timestamps null: false
    end
  end
end
