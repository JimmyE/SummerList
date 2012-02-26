require "rubygems"
require "sinatra/base"
require "sinatra/content_for"
require "sinatra/json"
#require "padrino-core/application/routing"

require "mongo_mapper"
require "./data/repo/delicious_repo"
require "./data/model/delicious_tag"
require "./data/model/delicious_bookmark"
require "./lib/logging"

class QuickieApp < Sinatra::Base
  register Sinatra::Logging
#  register Padrino::Routing
  helpers Sinatra::ContentFor
  helpers Sinatra::JSON

  set :public_folder, Proc.new { File.join(Dir.pwd, "public") }
  set :views,  Proc.new { File.join(Dir.pwd, "views") }

  #configure :development do
	# doesn't work
#	puts "disable dev logging"  #
#	disable :logging
#  end
  configure do
	begin
	  puts "Call app.configure"  # T*** TEMP ***

	  disable :logging
	  MongoMapper.connection = Mongo::Connection.new("localhost")
	  MongoMapper.database = "delbookmarks"
	  @dbConnected = true
	rescue StandardError => exc
	  @dbConnected = false
	  logger.error "Unable to connect to Mongo database! " + exc.to_s
	  puts "Error connecting to mongo database: " + exc.to_s
	end
  end

  get "/" do
	@tags = []
    haml :index
  end

  post "/tags" do
	userid = params['userid']
	#userid = params[:userid]
	logger.info("Get tags for " + userid)
	repo = DeliciousRepo.new(@dbConnected)

	buffer = repo.GetTags(userid)
	buffer.sort! { |a,b| b.Count <=> a.Count }

	@tags = buffer.slice(0, 12)
    #haml :index
	{ :results => @tags}.to_json
  end

  #padrino and mongo-mapper have conflicts on activesupport
  #post :bookmarks, :map => "getBookmarks" do
  post "/getBookmarks" do
	content_type :json

	logger.info("Get Bookmarks for: " + params['tag'])
	repo = DeliciousRepo.new(@dbConnected)
	bookmarkList = repo.GetBookmarks("jecker88", params['tag'])

	#haml :index  #  todo
	#redirect "/"
	#"Got em"
	# todo : how to return json ata?
#	json_result = JSON.parse bookmarkList
#	logger.info("GetBookmarks done!")
	#bookmarkList.to_json
	#foo = bookmarkList[0]
	#logger.warn("foo.Url: #{foo.Url}  desc: #{foo.Description}")
	#logger.warn json_result
	#json_result
	#{ :key1 => 'value1', :key2 => 'value2' }.to_json
	#json({:bm => foo}, :encoder => :to_json )
	#foo.to_json
	{ :results => bookmarkList}.to_json
  end
end
