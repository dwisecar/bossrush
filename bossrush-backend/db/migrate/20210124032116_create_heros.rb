class CreateHeros < ActiveRecord::Migration[6.1]
  def change
    create_table :heros do |t|
      t.string :name
      t.string :image
      t.string :melee_attack
      t.string :ranged_attack
      t.integer :health

      t.timestamps
    end
  end
end
