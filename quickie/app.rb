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
require "./lib/dbconnect"

class QuickieApp < Sinatra::Base
  register Sinatra::Logging
  helpers Sinatra::ContentFor
  helpers Sinatra::JSON

  set :public_folder, Proc.new { File.join(Dir.pwd, "public") }
  set :views,  Proc.new { File.join(Dir.pwd, "views") }

  configure :development do
	#info "DEVELOPMENT environment"
	QuickieDBConnect.MongoConnectDev
	@@dbConnected = true
  end
  configure :production do
	begin
	  #databaseEnv = ENV['MONGOHQ_URL']
	  #MongoMapper.connection = Mongo::Connection.from_uri(databaseEnv)
	  #buffer = databaseEnv.split("\/")
	  #MongoMapper.database = buffer[-1]

	  info " production databaseEnv #{databaseEnv}"
	  QuickieDBConnect.MongoConnectProd
	  @@dbConnected = true
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

	{ :results => bookmarkList}.to_json
  end
end
