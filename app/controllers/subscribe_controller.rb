class SubscribeController < ApplicationController
  def create
    logger.info "suscripcion #{params.inspect}"
    user = user_params(params)
    MailchimpWrapper.subscribe(user)
    redirect_to '/gracias'
  rescue Mailchimp::Error => e
    logger.error "ERROR mailchimp #{e.message} #{params.inspect}"
  end

  private

  def user_params(params)
    user = {
      email: params[:email].try(:downcase),
      first_name: params[:first_name].try(:titleize),
      last_name: params[:last_name].try(:titleize),
      city: params[:city].try(:titleize),
      phone: params[:phone],
      size: params[:size],
      bmeasure: params[:bmeasure],
      hcolor: params[:hcolor].try(:titleize),
      scolor: params[:scolor].try(:titleize)
    }
    user
  end
end