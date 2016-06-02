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

ActiveRecord::Schema.define(version: 20160602141735) do

  create_table "activities", force: :cascade do |t|
    t.string   "name"
    t.text     "info"
    t.integer  "company_id"
    t.integer  "activity_type_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  add_index "activities", ["activity_type_id"], name: "index_activities_on_activity_type_id"
  add_index "activities", ["company_id"], name: "index_activities_on_company_id"

  create_table "activity_modes", force: :cascade do |t|
    t.string   "name"
    t.text     "info"
    t.integer  "activity_type_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  add_index "activity_modes", ["activity_type_id"], name: "index_activity_modes_on_activity_type_id"

  create_table "activity_types", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comment_types", force: :cascade do |t|
    t.string   "name"
    t.text     "info"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comments", force: :cascade do |t|
    t.string   "for"
    t.integer  "comment_type_id"
    t.integer  "point_detail_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "comment"
  end

  add_index "comments", ["comment_type_id"], name: "index_comments_on_comment_type_id"
  add_index "comments", ["point_detail_id"], name: "index_comments_on_point_detail_id"

  create_table "companies", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "logo_url"
    t.string   "ruc"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "departments", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "districts", force: :cascade do |t|
    t.string   "name"
    t.integer  "province_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "districts", ["province_id"], name: "index_districts_on_province_id"

  create_table "expenses", force: :cascade do |t|
    t.text     "comment"
    t.decimal  "subtotal"
    t.decimal  "igv"
    t.decimal  "total"
    t.integer  "report_id"
    t.integer  "item_id"
    t.integer  "voucher_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "expenses", ["item_id"], name: "index_expenses_on_item_id"
  add_index "expenses", ["report_id"], name: "index_expenses_on_report_id"
  add_index "expenses", ["voucher_id"], name: "index_expenses_on_voucher_id"

  create_table "items", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "photos", force: :cascade do |t|
    t.string   "url"
    t.integer  "point_detail_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "photos", ["point_detail_id"], name: "index_photos_on_point_detail_id"

  create_table "point_details", force: :cascade do |t|
    t.string   "point"
    t.time     "start_time"
    t.time     "end_time"
    t.integer  "scope"
    t.decimal  "sales"
    t.integer  "people"
    t.string   "product"
    t.integer  "report_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.integer  "activity_mode_id"
  end

  add_index "point_details", ["activity_mode_id"], name: "index_point_details_on_activity_mode_id"
  add_index "point_details", ["report_id"], name: "index_point_details_on_report_id"

  create_table "provinces", force: :cascade do |t|
    t.string   "name"
    t.integer  "department_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "provinces", ["department_id"], name: "index_provinces_on_department_id"

  create_table "quantities", force: :cascade do |t|
    t.integer  "used"
    t.integer  "remaining"
    t.integer  "quantity_type_id"
    t.integer  "point_detail_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "name"
  end

  add_index "quantities", ["point_detail_id"], name: "index_quantities_on_point_detail_id"
  add_index "quantities", ["quantity_type_id"], name: "index_quantities_on_quantity_type_id"

  create_table "quantity_types", force: :cascade do |t|
    t.string   "name"
    t.text     "info"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "report_types", force: :cascade do |t|
    t.string   "name"
    t.text     "info"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reports", force: :cascade do |t|
    t.date     "start_date"
    t.date     "end_date"
    t.integer  "company_id"
    t.integer  "user_id"
    t.integer  "activity_id"
    t.integer  "district_id"
    t.integer  "report_type_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.integer  "province_id"
  end

  add_index "reports", ["activity_id"], name: "index_reports_on_activity_id"
  add_index "reports", ["company_id"], name: "index_reports_on_company_id"
  add_index "reports", ["district_id"], name: "index_reports_on_district_id"
  add_index "reports", ["province_id"], name: "index_reports_on_province_id"
  add_index "reports", ["report_type_id"], name: "index_reports_on_report_type_id"
  add_index "reports", ["user_id"], name: "index_reports_on_user_id"

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tokens", force: :cascade do |t|
    t.string   "token"
    t.datetime "expires_at"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "tokens", ["user_id"], name: "index_tokens_on_user_id"

  create_table "users", force: :cascade do |t|
    t.string   "nick_name"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "encrypted_password"
    t.string   "salt"
    t.string   "address"
    t.string   "phone"
    t.string   "dni"
    t.integer  "role_id"
    t.integer  "company_id"
    t.integer  "district_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.integer  "province_id"
  end

  add_index "users", ["company_id"], name: "index_users_on_company_id"
  add_index "users", ["district_id"], name: "index_users_on_district_id"
  add_index "users", ["province_id"], name: "index_users_on_province_id"
  add_index "users", ["role_id"], name: "index_users_on_role_id"

  create_table "vouchers", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
