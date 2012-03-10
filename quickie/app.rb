require "rubygems"
require "sinatra/base"
require "sinatra/content_for"
require "sinatra/json"
require "mongo_mapper"
require "uri"
require "./data/repo/delicious_repo"
require "./data/model/delicious_tag"
require "./data/model/delicious_bookmark"
require "./lib/logging"

class QuickieApp < Sinatra::Base
  register Sinatra::Logging
  helpers Sinatra::ContentFor
  helpers Sinatra::JSON

  set :public_folder, Proc.new { File.join(Dir.pwd, "public") }
  set :views,  Proc.new { File.join(Dir.pwd, "views") }

  configure :development do
	info "DEVELOPMENT environment"
	  #jfoo = "mongodb://eddie:eddiepwd@staff.mongohq.com:10038/app2686108"
	  #uri = URI.parse(foo)
	
	  databaseEnv = 'localhost'
	  MongoMapper.connection = Mongo::Connection.new(databaseEnv)
	  MongoMapper.database = "delbookmarks"
	  @@dbConnected = true
  end
  configure :production do
	info "PRODUCTION environment"
	begin
	  databaseEnv = ENV['MONGOHQ_URL']
	  #MongoMapper.connection = Mongo::Connection.new(databaseEnv)
	  #MongoMapper.connection = Mongo::Connection.from_uri(databaseEnv)

	  uri = URI.parse(ENV['MONGOHQ_URL'])
	  conn = Mongo::Connection.new(uri.host, uri.port)
	  db = conn.db(uri.path.gsub(/^\//, ''))
	  db.authenticate(uri.user, uri.password)
	  
	  #MongoMapper.db(
	  #MongoMapper.database = "delbookmarks"
	  info "databaseEnv #{databaseEnv}"
	  @@dbConnected = true
	rescue StandardError => exc
	  @@dbConnected = false
	  error! "Unable to connect to Mongo database! " + exc.to_s
	  puts " (puts) Error connecting to mongo database: " + exc.to_s
	end
  end
  configure do
	begin
	  @@dbConnected = true
	  info "Connected to mongoDB: " + @@dbConnected.to_s
	rescue StandardError => exc
	  @@dbConnected = false
	  error! "Unable to connect to Mongo database! " + exc.to_s
	  puts " (puts) Error connecting to mongo database: " + exc.to_s
	end
  end

  get "/" do
	@tags = []
    haml :index
  end

  post "/tags" do
	userid = params['userid']
	usecache = params['usecache']
	info "Get tags for #{userid}  useCache? #{usecache} dbConnected? #{@@dbConnected} "

	begin
	  repo = DeliciousRepo.new(@@dbConnected)
	  if usecache == "false"
		repo.ClearCacheForUser(userid)
	  end

	  buffer = repo.GetTags(userid)

	  buffer.sort! { |a,b| b.Count <=> a.Count }

	  @tags = buffer.slice(0, 12)   # 12 tags only
	  rc = 0
	rescue StandardError => exc
	  error! "GetTags failed. " + exc.to_s
	  @tags = ["System error " + exc.to_s]
	  rc = 1
	end

	{ :code => rc, :results => @tags}.to_json
  end

  #padrino and mongo-mapper have conflicts on activesupport
  #post :bookmarks, :map => "getBookmarks" do
  post "/getBookmarks" do
	content_type :json

	info("Get Bookmarks for: " + params['tag'])
	repo = DeliciousRepo.new(@@dbConnected)
	bookmarkList = repo.GetBookmarks("jecker88", params['tag'])

	#haml :index  #  todo
	#redirect "/"
	#"Got em"
	# todo : how to return json ata?
#	json_result = JSON.parse bookmarkList
#	info("GetBookmarks done!")
	#bookmarkList.to_json
	#foo = bookmarkList[0]
	#warn!("foo.Url: #{foo.Url}  desc: #{foo.Description}")
	#warn! json_result
	#json_result
	#{ :key1 => 'value1', :key2 => 'value2' }.to_json
	#json({:bm => foo}, :encoder => :to_json )
	#foo.to_json
	{ :results => bookmarkList}.to_json
  end
end
