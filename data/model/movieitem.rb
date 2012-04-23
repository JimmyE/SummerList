require 'mongo_mapper'
require 'bson'

class MovieItem
  include MongoMapper::Document

  key :_id #, bson::ObjectID, :index => true
  
  key :Username,  String
  key :Title,     String
  key :Notes,     String
  key :Genre,     String
  key :DateAdded, Date
  key :AddedBy,   String
  key :Length,    Integer
  key :Streaming, Boolean   # Netflix or Amazon Prime
  key :WhoFor,    String    #ethan, lucas or both
  key :Media,     String    # amazon, netflix, dv\
  key :Votes,     Array     #list of names

  #Not used yet
  key :Rating,  Integer
  key :Url,     String
  key :TagList, Array

#  index :Title, :unique => true
  validates_uniqueness_of :Title,

  #def initialize(user = "", tag = "", description = "", url = "")
	#@ParentTag = tag
	#@Description = description
	#@Url = url
  #end
end
