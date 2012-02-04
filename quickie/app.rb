require "rubygems"
require "sinatra/base"
require "sinatra/content_for"
require "sinatra/json"
require "padrino-core/application/routing"

#require "json"
require "./data/repo/delicious_repo"
require "./data/model/delicious_tag"
require "./data/model/delicious_bookmark"
require "./lib/logging"

class QuickieApp < Sinatra::Base
  register Sinatra::Logging
  register Padrino::Routing
  helpers Sinatra::ContentFor
  helpers Sinatra::JSON

  set :public_folder, Proc.new { File.join(Dir.pwd, "public") }
  set :views,  Proc.new { File.join(Dir.pwd, "views") }

  get :index do
	logger.info("Get tags")
	repo = DeliciousRepo.new

	buffer = repo.GetTags("jecker88")
	buffer.sort! { |a,b| b.Count <=> a.Count }

	@tags = buffer.slice(0, 12)
    haml :index
  end

  #post "/getBookmarks" do
  post :bookmarks, :map => "getBookmarks" do
	content_type :json

	logger.info("Get Bookmarks for: " + params['tag'])
	repo = DeliciousRepo.new
	bookmarkList = repo.GetBookmarks("jecker88", params['tag'])
	logger.info("GetBookmarks returned")

	bookmarkList.each do |bm|
	  logger.info(" bookmark: #{bm.Description}  #{bm.Url}")
	end

	#haml :index  #  todo
	#redirect "/"
	logger.info("create json")
	#"Got em"
	# todo : how to return json ata?
#	json_result = JSON.parse bookmarkList
#	logger.info("GetBookmarks done!")
	#bookmarkList.to_json
	foo = bookmarkList[0]
	#logger.warn("foo.Url: #{foo.Url}  desc: #{foo.Description}")
	#logger.warn json_result
	#json_result
	#{ :key1 => 'value1', :key2 => 'value2' }.to_json
	#json({:bm => foo}, :encoder => :to_json )
	#foo.to_json
	{ :results => bookmarkList}.to_json
  end
end
