require 'net/https'
require 'json'
require '../data/model/delicious_tag'

resp = href = "";
begin      
  #http = Net::HTTP.new("api.del.icio.us", 443)
  http = Net::HTTP.new("feeds.delicious.com", 80)
  #http.use_ssl = true

  tagList = Array.new
  tagList2 = Array.new

  http.start do |http|
    #req = Net::HTTP::Get.new("/v1/tags/get", {"User-Agent" => "juretta.com RubyLicious 0.2"})
    req = Net::HTTP::Get.new("/v2/json/tags/jecker88?count=100", 
							 {"User-Agent" => "juretta.com RubyLicious 0.2"})
    #req.basic_auth(username, password)
    response = http.request(req)
	if response.code != "200"
	  puts "Request failed. responseCode #{response.code}"
	  #return
	else
	  resp = response.body

	  #alist = JSON.load resp
	  alist = JSON.load response.body
	  puts "-----"
	  puts response.body
	  puts "-----"
	  puts alist
	  puts "--"
	  puts "--"

	  alist.each do |foo, cnt|
		tag = DeliciousTag.new
	    tag.Name = foo
	    tag.Count = cnt

	    #puts tag.to_s
	    tagList.push(tag)
	  end  # end 'do'

	  tagList2 = JSON.parse(response.body, :object_call => DeliciousTag)
	end  #end 'else'
  end  #end 'do' http.start

  puts "new"
  #puts tagList
  #puts ""
  #puts "2"
  #puts tagList2
#  tagList.each do |tag|
#	puts tag.Name
#  end

end
