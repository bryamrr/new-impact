class CreateExpenses < ActiveRecord::Migration
  def change
    create_table :expenses do |t|
      t.text :comment
      t.decimal :subtotal
      t.decimal :igv
      t.decimal :total
      t.references :report, index: true, foreign_key: true
      t.references :item, index: true, foreign_key: true
      t.references :voucher, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
