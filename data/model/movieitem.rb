require 'mongo_mapper'
require 'bson'

class MovieItem
  include MongoMapper::Document

  key :_id #, bson::ObjectID, :index => true
  
  key :Username
  key :Title
  key :Notes
  key :Genre
  key :DateAdded, Date
  key :AddedBy
  key :Length
  key :Streaming, Boolean   # Netflix or Amazon Prime
  key :WhoFor     #ethan, lucas or both

  key :Rating
  key :Url
  key :TagList

#  index :Title, :unique => true
  validates_uniqueness_of :Title,

  #def initialize(user = "", tag = "", description = "", url = "")
	#@ParentTag = tag
	#@Description = description
	#@Url = url
  #end
end
