class Api::V1::UsersController < Api::V1::BaseController
  skip_before_filter :authenticate, :only => [:login, :logout]

  # POST /api/v1/users
  def create
    if @current_user.role[:name] == "admin"
      if User.exists?(nick_name: params[:data][:nick_name])
        render :json => { :message => "El usuario ya existe" }
      else
        role = Role.find_by(name: params[:data][:role])
        @user = User.new(
          nick_name: params[:data][:nick_name],
          password: params[:data][:password],
          role: role
          )
        if @user.save
          render :json => { :message => "Usuario creado correctamente" }, status: :created
        else
          render :json => { :error => @user.errors.full_messages }
        end
      end
    else
      render :json => { :error => "No tiene permisos para crear usuario" }, status: :unauthorized
    end
  end

  # POST /api/v1/users/login
  def login
    data = {nick_name: params[:data][:nick_name], password: params[:data][:password]}
    user = User.authenticate(data)

    if user
      token = user.tokens.create
      render :json => { :token => token.token, :nick_name => user.nick_name, :role => user.role[:name] }
    else
      render :json => { :error => "No tiene permisos para crear usuario" }, status: :unauthorized
    end
  end

  # POST /api/v1/users/logout
  def logout
    token_str = params[:data][:token]

    token = Token.find_by(token: token_str)
    if token.delete
      render :json => { :message => "El token ha expirado" }
    else
      render :json => { :error => token.errors.full_messages }
    end
  end
end