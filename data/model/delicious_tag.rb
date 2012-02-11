require 'rubygems'
require 'mongo_mapper'

class DeliciousTag
  include MongoMapper::Document

  key :Username, String
  key :Name, String
  key :Count, String

  def initialize(user = "", name = "", count = "")
	@Username = user
	@Name = name
	@Count = count
  end

  def to_s
	"#{@Name} - #{@Count}"
  end
end
