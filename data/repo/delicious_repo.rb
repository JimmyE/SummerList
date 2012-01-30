require "sinatra/base"
require 'net/https'
require 'json'
#require "./helpers/logging"

class DeliciousRepo 
  #register Sinatra::Logging

  def GetTags(deliciousUser)
	results = Array.new
	resp = href = "";
	#http = Net::HTTP.new("api.del.icio.us", 443)
	http = Net::HTTP.new("feeds.delicious.com", 80)
	#http.use_ssl = true

	http.start do |http|
	  #req = Net::HTTP::Get.new("/v1/tags/get", {"User-Agent" => "juretta.com RubyLicious 0.2"})
	  req = Net::HTTP::Get.new("/v2/json/tags/#{deliciousUser}?count=100", 
							 {"User-Agent" => "juretta.com RubyLicious 0.2"})
	  #req.basic_auth(username, password)
	  response = http.request(req)
	  #puts "Response code = #{response.code}"

	  if response.code != "200"
		#logger.error!("Request failed. responseCode #{response.code}")
		puts "Request failed. responseCode #{response.code}"
	  else
		#puts response.body
		buffer = JSON.load response.body

		# TODO ** check return code for error
		#puts buffer
		#puts buffer[0]
		#puts buffer[0].key?("code")
		#if response.body.key?("code")
		  #logger.error!("Request failed. " + buffer.to_s)
		#end

		buffer.each do |name, cnt|
		 tag = DeliciousTag.new
		  tag.Name = name
		  tag.Count = cnt

		  #puts tag.to_s
		  results.push(tag)
		end  # end 'do'
	  end  #end 'else'
	end  #end 'do' http.start

	results
  end

  def GetBookmarks(deliciousUser, tagName)
	resp = href = "";
	#http = Net::HTTP.new("api.del.icio.us", 443)
	http = Net::HTTP.new("feeds.delicious.com", 80)
	#http.use_ssl = true
	#http://feeds.delicious.com/v2/json/jecker88/programming?count=100

	results = Array.new

	http.start do |http|
	  #req = Net::HTTP::Get.new("/v1/tags/get", {"User-Agent" => "juretta.com RubyLicious 0.2"})
	  url = "/v2/json/#{deliciousUser}/#{tagName}?count=100" 
	  #puts "url: " + url
	  #req = Net::HTTP::Get.new("/v2/json/#{deliciousUser}/#{tagName}?count=100", 
	  req = Net::HTTP::Get.new(url,
							 {"User-Agent" => "juretta.com RubyLicious 0.2"})
	  #req.basic_auth(username, password)
	  response = http.request(req)
	  #puts "Response code = #{response.code}"

	  if response.code != "200"
		#logger.error!("Request failed. responseCode #{response.code}")
		puts "Request failed. responseCode #{response.code}"
		puts req.to_s
	  else
		buffer = JSON.load response.body
		#logger.info buffer.to_s
		#puts buffer.to_s
		if buffer == nil
		  puts "Buffer json is null"
		  return
		end
		#buffer.each do |a, d, n, u, t, dt|
		buffer.each do |foo|
		  if foo == nil
			puts "url is NULL???  a = " + a.to_s
		  else
			puts "Create new bookmark for " + foo["u"]
			tag = DeliciousBookmark.new
			tag.Description = foo["d"]
			tag.Url = foo["u"]

		    results.push(tag)
		  end
		end # end buffer.each
		#puts "buffer.each done"
	  end #if repsonse is 200
	end #end http-start
	puts "GetBookmarks done"
	results
  end

end

