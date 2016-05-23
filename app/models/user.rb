class User < ActiveRecord::Base
  attr_accessor :password

  belongs_to :role
  belongs_to :company
  belongs_to :district
  has_many :reports

  validates :nick_name, presence: true
  validates :role, presence: true
  validates :password, presence: true
  validates :email, email: true, :allow_blank => true
  validates_length_of :password, :in => 6..10

  before_create :encrypt_password

  def self.authenticate(nick_name, password)
    user = User.where(nick_name: nick_name)
    if (user)
      puts user.password
      encrypted_password = BCrypt::Engine.hash_secret(password, user.salt)
      if user.encrypted_password == encrypted_password
        return true
      else
        return false
      end
    else
      return false
    end


  end

  private
  def encrypt_password
    self.salt = BCrypt::Engine.generate_salt
    self.encrypted_password= BCrypt::Engine.hash_secret(password, salt)
  end
end
