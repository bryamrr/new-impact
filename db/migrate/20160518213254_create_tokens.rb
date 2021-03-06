class CreateTokens < ActiveRecord::Migration
  def change
    create_table :tokens do |t|
      t.string :token
      t.datetime :expires_at
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
