require "rubygems"

class DeliciousTag
  attr_accessor :Name
  attr_accessor :Count

  def to_s
	"#{@Name} - #{@Count}"
  end
end
