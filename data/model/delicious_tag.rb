require "rubygems"

class DeliciousTag
  attr_accessor :Name
  attr_accessor :Count

  def initialize(name = "", count = "")
	@Name = name
	@Count = count
  end

  def to_s
	"#{@Name} - #{@Count}"
  end
end
