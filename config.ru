require "rubygems"
require "./quickie/app"
require "./morelists/MoreListsApp"

#for Heroku logging support
$stdout.sync = true

before do
  expires 500, :public, :must_revalidate
end

map "/" do
  run QuickieApp
end
#map "/morelists" do
#  run MoreListsApp
#end
map "/movies" do
  run MoreListsApp
end
