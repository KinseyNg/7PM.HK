class CreateMsgs < ActiveRecord::Migration
  def change
    create_table :msgs do |t|
      t.string :sender
      t.string :receiver
      t.string :main
      t.integer :read
      t.string :type

      t.timestamps null: false
    end
  end
end
