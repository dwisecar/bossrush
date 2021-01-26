class CreateHeros < ActiveRecord::Migration[6.1]
  def change
    create_table :heros do |t|
      t.text :name
      t.text :image
      t.text :melee_attack
      t.text :ranged_attack
      t.integer :health

      t.timestamps
    end
  end
end
