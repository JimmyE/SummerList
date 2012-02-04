require 'rubygems'
require 'sinatra'
require 'sinatra/base'
require 'json'
require './data/model/delicious_tag'
require './data/model/delicious_bookmark'
require './data/repo/delicious_repo'

#  *** run from base directory:  ruby test/test2.rb

repo = DeliciousRepo.new

#data = repo.GetTags("jecker88")
bookmarkList = repo.GetBookmarks("jecker88", "blogs")

puts "Print bookmark list"
bookmarkList.each do |bm|
  puts(" bookmark: #{bm}")
end
#puts data.to_s

