class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :provider
      t.string :uid
      t.string :name
      t.string :oauth_token
      t.datetime :oauth_expires_at
      t.string :pic
      t.string :email
      t.datetime :signup_date
      t.datetime :last_login
      t.string :ip
      t.string :firstName
      t.string :lastName
      t.string :birthday
      t.string :locale
      t.string :gender
      t.string :link
      t.string :timezone
      t.string :religion
      t.string :profile_name
      t.string :updated_time

      t.timestamps null: false
    end
  end
end
