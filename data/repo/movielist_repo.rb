require "sinatra"
require "sinatra/base"
require 'net/https'
require 'json'
require "./lib/logging"

class MovieListRepo 
  include Sinatra::Logging

  def initialize
  end

  def GetAlLSortBy(field)
	return MovieItem.all(:order => field)
  end

  def GetAll
	#movieList = MovieItem.all(:order => "Title")
	movieList = MovieItem.all(:order => :Title.asc)
	#movieList = MovieItem.all
	#movieList = MovieItem.sort(:Title)  #the 'Url' property doesn't get serialized in json
	movieList
  end

  def SaveMovie(movie)
	 raise "movie must be a MovieItem" unless movie.kind_of? MovieItem
	 info "Save the movie: #{movie.Title}"
	 movie.save
  end

end

