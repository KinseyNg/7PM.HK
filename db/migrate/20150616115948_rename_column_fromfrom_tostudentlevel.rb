class RenameColumnFromfromTostudentlevel < ActiveRecord::Migration
  def self.up
    rename_column :books, :from, :stu_f
  end

  def self.down
    # rename back if you need or do something else or do nothing
  end
end
