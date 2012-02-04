require "sinatra/base"

module Sinatra
	module Logging
		def logger
			@logger ||= Logger.new("log/#{ENV["RACK_ENV"]}.log")
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
		  @xlog ||= Logger.new("log/#{ENV["RACK_ENV"]}.log")
		  @xlog.info(msg)
		end
		def error msg
		  @xlog ||= Logger.new("log/#{ENV["RACK_ENV"]}.log")
		  @xlog.error!(msg)
		end
	  end
	end #module
end
