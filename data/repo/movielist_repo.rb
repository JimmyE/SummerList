require "sinatra"
require "sinatra/base"
require 'net/https'
require 'json'
require "./lib/logging"

class MovieListRepo 
  include Sinatra::Logging

  def initialize
  end

  def GetAll
	#movieList = MovieItem.all.sort({ Title :1 })
	movieList = MovieItem.sort(:Title)
	movieList
  end

  def SaveMovie(movie)
	 raise "movie must be a MovieItem" unless movie.kind_of? MovieItem
	 info "Save the movie: #{movie.Title}"
	 movie.save
  end

end

