module MailchimpWrapper

  def self.subscribe(user)
    mailchimp = Mailchimp::API.new(ENV['MAILCHIMP_API_KEY'])
    merge_vars = merge_vars_hash(user)
    mailchimp.lists.subscribe(
      ENV['MAILCHIMP_LIST_ID'],
      { email: user[:email] },
      merge_vars,
      'html',
      false,
      true,
      false,
      false
      )
  end

  def self.merge_vars_hash(user)
    merge_vars = {}
    merge_vars[:fname] = user[:first_name] unless user[:first_name].blank?
    merge_vars[:lname] = user[:last_name] unless user[:last_name].blank?
    merge_vars[:city] = user[:city] unless user[:city].blank?
    merge_vars[:phone] = user[:phone] unless user[:phone].blank?
    merge_vars[:size] = user[:size] unless user[:size].blank?
    merge_vars[:bmeasure] = user[:bmeasure] unless user[:bmeasure].blank?
    merge_vars[:hcolor] = user[:hcolor] unless user[:hcolor].blank?
    merge_vars[:scolor] = user[:scolor] unless user[:scolor].blank?
    merge_vars

  end

end