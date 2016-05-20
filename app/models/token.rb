class Token < ActiveRecord::Base
  belongs_to :user
  has_many :reports
  has_many :tokens

  before_create :generate_token

  private
  def generate_token
    begin
      self.token = SecureRandom.hex
    end while Token.where(token: self.token).any?
    self.expires_at = 1.month.from_now
  end
end
