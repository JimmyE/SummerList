
class DeliciousBookmark
  attr_accessor :Description
  attr_accessor :Url
  attr_accessor :DateAdded
  attr_accessor :TagList

  def to_json(*a)
	{
	  #'json_class' => self.class.name,
	  #'data' => [@Description, @Url]
	  'd' => @Description,
	  'u' => @Url
	}.to_json(*a)
  end

#  def to_s
#	"#{@Description} - #{@Url}"
#  end
end
