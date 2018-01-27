class CreateCatForms < ActiveRecord::Migration
  def change
    create_table :cat_forms do |t|
      t.string :form_name
      t.integer :total

      t.timestamps null: false
    end
  end
end
