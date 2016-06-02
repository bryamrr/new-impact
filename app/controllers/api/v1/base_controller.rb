class Api::V1::BaseController < ApplicationController
  # protect_from_forgery with: :null_session

  before_action :authenticate

  def authenticate
    @token_str = bearer_token
    token = Token.find_by(token: @token_str)

    if token.nil? || !token.is_valid?
      render :json => { :error => "Token inválido" }, status: :unauthorized
    else
      @current_user = token.user
    end
  end

  def bearer_token
    pattern = /^Bearer /
    header  = request.headers["Authorization"]
    header.gsub(pattern, '') if header && header.match(pattern)
  end
end