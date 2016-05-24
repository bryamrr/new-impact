class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.date :start_date
      t.date :end_date
      t.references :company, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true
      t.references :activity, index: true, foreign_key: true
      t.references :district, index: true, foreign_key: true
      t.references :report_type, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
