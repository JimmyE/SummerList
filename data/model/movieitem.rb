require 'mongo_mapper'
require 'bson'

class MovieItem
  include MongoMapper::Document

  key :_id #, bson::ObjectID, :index => true
  
  key :Username, String
  key :Title, String
  key :Notes, String
  key :Genre, String
  key :DateAdded, Date
  key :AddedBy, String
  key :Length, Integer
  key :Streaming, Boolean   # Netflix or Amazon Prime
  key :WhoFor     #ethan, lucas or both
  key :Media    # amazon, netflix, dv\

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
