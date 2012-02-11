require "sinatra/base"

module Sinatra
	module Logging
		def logger
		  #puts "create logger" unless @logger
			#@logger ||= Logger.new("log/#{ENV["RACK_ENV"]}.log")
			@logger ||= Logger.new(STDOUT)
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

	  class XLogger
		def info msg
		  @xlog ||= createLogger
		  #@xlog.info(msg)
		end
		def error msg
		  @xlog ||= createLogger
		  #@xlog.error!(msg)
		end

		def createLogger
		  #Logger.new("log/#{ENV["RACK_ENV"]}.log")
		  Logger.new(STDOUT)
		end
	  end
	end #module
end
