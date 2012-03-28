module QuickieDBConnect

  def MongoConnectDev
	@databaseEnv = 'localhost'
	MongoMapper.connection = Mongo::Connection.new(@databaseEnv)
	MongoMapper.database = "delbookmarks"
	"delbookmarks"
  end

  def MongoConnectProd
	@databaseEnv = ENV['MONGOHQ_URL']
	MongoMapper.connection = Mongo::Connection.from_uri(@databaseEnv)
	buffer = @databaseEnv.split("\/")
	MongoMapper.database = buffer[-1]
	buffer[-1]
  end

  module_function :MongoConnectDev
  module_function :MongoConnectProd
end
