require 'mongo_mapper'

class MovieItem
  include MongoMapper::Document

  key :Username
  key :Title
  key :Rating
  key :Notes
  key :Url
  key :DateAdded
  key :TagList

  #def initialize(user = "", tag = "", description = "", url = "")
	#@ParentTag = tag
	#@Description = description
	#@Url = url
  #end
end
