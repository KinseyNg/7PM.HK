class CreateBooks < ActiveRecord::Migration
  def change
    create_table :books do |t|
      t.integer :seller
      t.integer :buyer
      t.string :main
      t.string :title
      t.string :pic1
      t.string :pic2
      t.string :pic3
      t.integer :subject
      t.integer :from
      t.string :location
      t.integer :view
      t.integer :ask
      t.integer :status
      t.decimal :price

      t.timestamps null: false
    end
  end
end
