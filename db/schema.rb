# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150618131330) do

  create_table "books", force: :cascade do |t|
    t.integer  "seller"
    t.integer  "buyer"
    t.integer  "price"
    t.integer  "stu_f"
    t.string   "status"
    t.string   "public_year"
    t.string   "title"
    t.string   "subject"
    t.string   "main"
    t.string   "ip"
    t.string   "photo1_file_name"
    t.string   "photo1_content_type"
    t.string   "photo1_file_size"
    t.datetime "photo1_updated_at"
    t.string   "photo2_file_name"
    t.string   "photo2_content_type"
    t.string   "photo2_file_size"
    t.datetime "photo2_updated_at"
    t.string   "photo3_file_name"
    t.string   "photo3_content_type"
    t.string   "photo3_file_size"
    t.datetime "photo3_updated_at"
    t.integer  "ask"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "location"
    t.string   "sold"
  end

  create_table "bootsy_image_galleries", force: :cascade do |t|
    t.integer  "bootsy_resource_id"
    t.string   "bootsy_resource_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "bootsy_images", force: :cascade do |t|
    t.string   "image_file"
    t.integer  "image_gallery_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cat_forms", force: :cascade do |t|
    t.string   "form_name"
    t.integer  "total"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "cms", force: :cascade do |t|
    t.integer  "title_id"
    t.integer  "user_id"
    t.string   "cm_main"
    t.string   "ip"
    t.integer  "mode"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "photo1_file_name"
    t.string   "photo1_content_type"
    t.integer  "photo1_file_size"
    t.datetime "photo1_updated_at"
    t.string   "an_user"
  end

  create_table "forum1s", force: :cascade do |t|
    t.string   "category"
    t.integer  "mode"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "forums", force: :cascade do |t|
    t.string   "category"
    t.integer  "mode"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "ig_categories", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.integer  "clickcount"
    t.string   "icon"
  end

  create_table "ig_q_and_as", force: :cascade do |t|
    t.integer  "ig_shop_id"
    t.string   "ig_q"
    t.integer  "ig_a"
    t.integer  "can_view"
    t.integer  "order"
    t.string   "color"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ig_shops", force: :cascade do |t|
    t.string   "shop_title"
    t.string   "owner_name"
    t.string   "items_count"
    t.string   "shop_des"
    t.integer  "user_id"
    t.string   "location"
    t.integer  "item_count"
    t.string   "status"
    t.integer  "level"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "link"
    t.integer  "shop_id"
    t.integer  "media"
    t.integer  "follows"
    t.string   "profile_picture"
    t.integer  "followed_by"
    t.integer  "site_id"
  end

  create_table "items", force: :cascade do |t|
    t.integer  "ig_shop_id"
    t.string   "item_des"
    t.string   "item_url"
    t.integer  "item_num"
    t.string   "item_img"
    t.integer  "item_bought"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "messages", force: :cascade do |t|
    t.integer  "read"
    t.string   "title"
    t.string   "main"
    t.string   "ip"
    t.integer  "sender"
    t.integer  "receiver"
    t.integer  "type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "msgs", force: :cascade do |t|
    t.string   "sender"
    t.string   "receiver"
    t.string   "main"
    t.integer  "read"
    t.string   "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "titles", force: :cascade do |t|
    t.string   "title_name"
    t.integer  "forum_id"
    t.integer  "user_id"
    t.integer  "cm_count"
    t.string   "create_ip"
    t.integer  "mode"
    t.string   "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "provider"
    t.string   "uid"
    t.string   "name"
    t.string   "oauth_token"
    t.datetime "oauth_expires_at"
    t.string   "pic"
    t.string   "email"
    t.datetime "signup_date"
    t.datetime "last_login"
    t.string   "ip"
    t.string   "firstName"
    t.string   "lastName"
    t.string   "birthday"
    t.string   "locale"
    t.string   "gender"
    t.string   "link"
    t.string   "timezone"
    t.string   "religion"
    t.string   "profile_name"
    t.string   "updated_time"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "password"
    t.string   "tel"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.integer  "speak_count"
  end

end
