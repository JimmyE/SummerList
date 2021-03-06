require "sinatra"
require "sinatra/base"
require 'net/https'
require 'json'
require "./lib/logging"

class DeliciousRepo 
  include Sinatra::Logging

  def initialize(connectedToDb)
	@useDatabase = connectedToDb 
  end

  def ClearCacheForUser (deliciousUser)
	if ! @useDatabase
	  return
	end

	info "Clear cache for user: #{deliciousUser}"
	DeliciousTag.delete_all(:Username => deliciousUser)
	DeliciousBookmark.delete_all(:Username => deliciousUser)
  end

  def GetTags(deliciousUser)
	results = Array.new

	tags = DeliciousTag.all(:Username => deliciousUser) if @useDatabase
	if tags != nil && tags.count > 0
	  info  "Got tags from database (cache)"
	  tags   # TODO * use "return tags"  ??
	else
	  info  "Get tags by calling Delicious web api"

	  url = "/v2/json/tags/#{deliciousUser}?count=100"
	  response = GetDeliciousResponse(url)

	  if response.content_type == "application/json"
		buffer = JSON.load response.body
		#buffer = [{'result'=>{'message'=>'something went wrong', 'code'=>1000}}]

		if buffer.kind_of?(Array)
		  buffer = buffer.pop
		end

		# TODO ** check return code for error
		if buffer.key?("result")
		  error!("Request failed. " + buffer.to_s)
		  message = buffer["result"]["message"]
		  code = buffer["result"]["code"]
		  raise "Delicious returned an error: #{code} #{message}"
		end

		DeliciousTag.delete_all(:Username => deliciousUser) if @useDatabase
		buffer.each do |name, cnt|
		  #results.push(DeliciousTag.new deliciousUser, name, cnt)
		  tag = DeliciousTag.new deliciousUser, name, cnt
		  tag.save if @useDatabase
		  results.push tag
		end
	  else
		  tag = DeliciousTag.new deliciousUser, "Error", 1
		  results.push tag
	  end
	  results
	end
  end

  def GetBookmarks(deliciousUser, tagName)
	results = Array.new

	bookmarks = DeliciousBookmark.all(:Username => deliciousUser, :ParentTag => tagName) if @useDatabase
	if bookmarks != nil && bookmarks.count > 0
	  info("return bookmarks for #{tagName} from database")
	  bookmarks
	else
	  info("send webrequest for bookmarks for #{tagName} ")
	  url = "/v2/json/#{deliciousUser}/#{tagName}?count=100" 

	  response = GetDeliciousResponse(url)

	  buffer = JSON.load response.body
	  if buffer == nil
	   error! "json buffer is null"
	   return
	  end

	  DeliciousBookmark.delete_all(:Username => deliciousUser, :ParentTag => tagName) if @useDatabase
	  buffer.each do |foo|
		info "Create new bookmark for '" + deliciousUser + "' " + foo["u"] + "  tag: " + tagName
		bookmark = DeliciousBookmark.new deliciousUser, tagName, foo["d"], foo["u"]
		bookmark.save if @useDatabase
		results.push bookmark
	  end # end buffer.each

	  info "GetBookmarks done"
	  results
	end
  end

  def GetDeliciousResponse(url)
	response = "";
	#http = Net::HTTP.new("api.del.icio.us", 443)
	http = Net::HTTP.new("feeds.delicious.com", 80)
	#http.use_ssl = true
	#http://feeds.delicious.com/v2/json/jecker88/programming?count=100

	begin
	  http.start do |http|
		req = Net::HTTP::Get.new(url,
							  {"User-Agent" => "juretta.com RubyLicious 0.2"})
		#req.basic_auth(username, password)
		response = http.request(req)
 
		if response.code != "200"
		  error!("Request failed. responseCode #{response.code}  response: " + req.to_s)
		  raise "Unable to get Delicious server"
		end
	  end #end http-start
	  response
	rescue StandardError => exc
		error! "GetDeliciousResponse() error: " + exc.to_s
	end
  end
end

