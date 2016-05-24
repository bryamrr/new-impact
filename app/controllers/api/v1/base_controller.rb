class Api::V1::BaseController < ApplicationController
  # protect_from_forgery with: :null_session

  before_action :authenticate

  def authenticate
    token_str = params[:data][:token]
    token = Token.find_by(token: token_str)

    if token.nil? || !token.is_valid?
      render :json => { :error => "Token inválido" }, status: :unauthorized
    else
      @current_user = token.user
    end
  end
end