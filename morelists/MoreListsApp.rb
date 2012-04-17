require "rubygems"
require "sinatra/base"
require "sinatra/content_for"
require "sinatra/json"
require "mongo_mapper"
require "uri"
require "./data/repo/movielist_repo"
require "./data/model/movieitem"
require "./lib/logging"

class MoreListsApp < Sinatra::Base
  register Sinatra::Logging
  helpers Sinatra::ContentFor
  helpers Sinatra::JSON

  set :public_folder, Proc.new { File.join(Dir.pwd, "public") }
  set :views,  Proc.new { File.join(Dir.pwd, "views/morelists") }

  configure :development do
	#info "DEVELOPMENT environment"
	dbname = QuickieDBConnect.MongoConnectDev
    #info " dev dbname: #{dbname}"
  end
  configure :production do
	begin
	  info " production databaseEnv #{databaseEnv}"
	  dbname = QuickieDBConnect.MongoConnectProd
	  #info " prod dbname: #{dbname}"
	rescue StandardError => exc
	  error! "Unable to connect to Mongo database! " + exc.to_s
	  puts " (puts) Error connecting to mongo database: " + exc.to_s
	end
  end

  get "/" do
	@movies = []
    haml :index
  end

  post "/movies" do
	repo = MovieListRepo.new
	@movies = repo.GetAll
	baseUrl = "http://www.imdb.com/find?q="
	@movies.each do |movie|
	  buffer = movie.Title.split().join('+')
	  movie.Url = baseUrl + buffer + '&s=all'
	  #info "movie url: #{movie.Url}"
	end

	{ :code => 0, :results => @movies}.to_json
  end

  post "/addmovie" do
	begin
	  id = params['id']
	  if id == '0'  
		mi = MovieItem.new
		mi.DateAdded = DateTime.now
		mi.AddedBy = params['user']
	  else 
		mi = MovieItem.find(BSON::ObjectId(id))
	  end

	  mi.Title = params['title']
	  mi.Notes = params['notes']
	  mi.Genre = params['genre']
	  mi.Length = params['length']
	  mi.Streaming = params['streaming']
	  mi.WhoFor = params['whofor']
	  mi.Media = params['media']

	  info "Add movie '#{mi.Title}'  Notes: #{mi.Notes}  Genre: #{mi.Genre} Added #{mi.DateAdded} Streaming: #{mi.Streaming}"
	  repo = MovieListRepo.new
	  repo.SaveMovie(mi)

	  { :code => 0 }.to_json
	rescue StandardError => exc
	  error "Error saving movie: " + exc.to_s;
	end
  end

  post "/login" do
	uid = params['user'].downcase
	pwd = params['password']

	rc = 1  #failed
	if uid == 'jim' || uid == 'honghong' || uid == 'ethan' || uid == 'lucas'
	  if pwd == uid
	   rc = 0
	  end
	end

	{ :code => rc }.to_json
  end

  get "/movie" do
	id = params['movieid']
	info "Get movie with id: #{id}"

	mi = MovieItem.find(BSON::ObjectId(id))
	{ :code => 0, :results => mi}.to_json
  end
end
