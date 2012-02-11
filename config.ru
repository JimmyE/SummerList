require "rubygems"
require "./quickie/app"

#set :logging false
disable :logging

#for Heroku logging support
$stdout.sync = true

map "/" do
  run QuickieApp
end
