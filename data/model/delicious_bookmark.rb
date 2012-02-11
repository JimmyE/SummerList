require 'mongo_mapper'

class DeliciousBookmark
  include MongoMapper::Document

  key :Username
  key :ParentTag
  key :Description
  key :Url
  key :DateAdded
  key :TagList

  def initialize(user = "", tag = "", description = "", url = "")
	@Username = user
	@ParentTag = tag
	@Description = description
	@Url = url
  end
end
