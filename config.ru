require "rubygems"
require "./quickie/app"

#for Heroku logging support
$stdout.sync = true

map "/" do
  run QuickieApp
end
