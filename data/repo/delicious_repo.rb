require "sinatra"
require "sinatra/base"
require 'net/https'
require 'json'
require "./lib/logging"

class DeliciousRepo 

  def initialize
	# todo: make myLogger a static? property
	@myLogger = Sinatra::Logging::XLogger.new
  end

  def GetTags(deliciousUser)
	results = Array.new
	url = "/v2/json/tags/#{deliciousUser}?count=100"
	response = GetDeliciousResponse(url)

	buffer = JSON.load response.body

	# TODO ** check return code for error
	#if response.body.key?("code")
	  #logger.error!("Request failed. " + buffer.to_s)
	#end

	buffer.each do |name, cnt|
	 results.push(DeliciousTag.new name, cnt)
	end

	results
  end

  def GetBookmarks(deliciousUser, tagName)
	results = Array.new

	url = "/v2/json/#{deliciousUser}/#{tagName}?count=100" 

	response = GetDeliciousResponse(url)

	buffer = JSON.load response.body
	if buffer == nil
	  @myLogger.error "json buffer is null"
	  return
	end

	buffer.each do |foo|
	  @myLogger.info "Create new bookmark for " + foo["u"]
	  results.push(DeliciousBookmark.new foo["d"], foo["u"] )
	end # end buffer.each

	@myLogger.info "GetBookmarks done"
	results
  end

  def GetDeliciousResponse(url)
	response = "";
	#http = Net::HTTP.new("api.del.icio.us", 443)
	http = Net::HTTP.new("feeds.delicious.com", 80)
	#http.use_ssl = true
	#http://feeds.delicious.com/v2/json/jecker88/programming?count=100

	http.start do |http|
	  req = Net::HTTP::Get.new(url,
							 {"User-Agent" => "juretta.com RubyLicious 0.2"})
	  #req.basic_auth(username, password)
	  response = http.request(req)

	  if response.code != "200"
		@myLogger.error("Request failed. responseCode #{response.code}  response: " + req.to_s)
		raise "Unable to get Delicious server"
	  end
	end #end http-start
	response
  end
end

