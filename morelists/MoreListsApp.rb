require "rubygems"
require "sinatra/base"
require "sinatra/content_for"
require "sinatra/json"
require "mongo_mapper"
require "uri"
require "./data/repo/delicious_repo"
require "./data/model/movieitem"
require "./lib/logging"

class MoreListsApp < Sinatra::Base
  register Sinatra::Logging
  helpers Sinatra::ContentFor
  helpers Sinatra::JSON

  set :public_folder, Proc.new { File.join(Dir.pwd, "public") }
  set :views,  Proc.new { File.join(Dir.pwd, "views/morelists") }

  configure :development do
	info "DEVELOPMENT environment"
	  #jfoo = "mongodb://eddie:eddiepwd@staff.mongohq.com:10038/app2686108"
	  #uri = URI.parse(foo)
	
	  databaseEnv = 'localhost'
	  MongoMapper.connection = Mongo::Connection.new(databaseEnv)
	  MongoMapper.database = "delbookmarks"
	  #env = "mongodb://heroku:762cf00a143d7d288e811edaf7f9cb06@staff.mongohq.com:10038/app2686108"
	  #foo = env.split("\/")
	  #dbname = foo[-1]
	  #MongoMapper.connection = Mongo::Connection.from_uri(env)
	  #MongoMapper.database = "app2686108"
	  #MongoMapper.database = dbname

	  @@dbConnected = true
  end
  configure :production do
	begin
	  databaseEnv = ENV['MONGOHQ_URL']
	  #MongoMapper.connection = Mongo::Connection.new(databaseEnv)
	  MongoMapper.connection = Mongo::Connection.from_uri(databaseEnv)
	  buffer = databaseEnv.split("\/")
	  MongoMapper.database = buffer[-1]

	  #uri = URI.parse(ENV['MONGOHQ_URL'])
	  #conn = Mongo::Connection.new(uri.host, uri.port)
	  #db = conn.db(uri.path.gsub(/^\//, ''))
	  #db.authenticate(uri.user, uri.password)
	  
	  #MongoMapper.db(
	  #MongoMapper.database = "delbookmarks"
	  #info "databaseEnv #{databaseEnv} user: #{uri.user}  pwd: #{uri.password} port: #{uri.port} "
	  info " production databaseEnv #{databaseEnv}"
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
	@movies = []
    haml :index
  end

  post "/movies" do
	@movies = []
	mi = MovieItem.new
	mi.Title = 'Sunset Boulvard'
	mi.Username = 'Jim'
	mi.Rating = 'Medium'
	@movies.push mi

	mi2 = MovieItem.new
	mi2.Title = 'They Drive By Night'
	mi2.Username = 'Jim'
	mi2.Rating = 'Medium'
	@movies.push mi2

	rc = 0
	{ :code => rc, :results => @movies}.to_json
  end
end
