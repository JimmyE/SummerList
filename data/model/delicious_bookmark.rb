
class DeliciousBookmark
  attr_accessor :Description
  attr_accessor :Url
  attr_accessor :DateAdded
  attr_accessor :TagList

  def initialize( description = "", url = "")
	@Description = description
	@Url = url
  end

  def to_json(*a)
	{
	  #'json_class' => self.class.name,
	  #'data' => [@Description, @Url]
	  'd' => @Description,
	  'u' => @Url
	}.to_json(*a)
  end
end
