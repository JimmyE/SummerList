require 'json'
require '../data/model/delicious_tag'
require '../data/model/delicious_bookmark'
require '../data/repo/delicious_repo'


repo = DeliciousRepo.new

#data = repo.GetTags("jecker88")
bookmarkList = repo.GetBookmarks("jecker88", "blogs")

puts "Print bookmark list"
bookmarkList.each do |bm|
  puts(" bookmark: #{bm}")
end
#puts data.to_s

