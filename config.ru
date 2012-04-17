require "rubygems"
require "./quickie/app"
require "./morelists/MoreListsApp"

#for Heroku logging support
$stdout.sync = true

map "/" do
  run QuickieApp
end
map "/morelists" do
  run MoreListsApp
end
map "/movies" do
  run MoreListsApp
end
