require "sinatra/base"

module Sinatra
	module Logging
		def logger
		  if ENV["RACK_ENV"] == "production"
			@logger ||= Logger.new(STDOUT)
			puts "Production version"
		  else
			@logger ||= Logger.new("log/#{ENV["RACK_ENV"]}.log")
		  end
			
			@logger ||= Logger.new(STDOUT)
			puts "FOO logger use stdout"
		  @logger  
		end

		def info(mssg)
			logger.info("INFO: #{Time.now} - #{mssg}")
		end
		def warn!(mssg)
			logger.info("WARN: #{Time.now} - #{mssg}")
		end
		def error!(mssg)
			logger.info("ERROR: #{Time.now} - #{mssg}")
		end

		def self.registered(app)
		 app.helpers Logging
		end
	end #module
end
