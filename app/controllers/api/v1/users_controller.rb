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
          render :json => { :errors => @user.errors.full_messages }
        end
      end
    else
      render :json => { :errors => "No tiene permisos para crear usuario" }, status: :unauthorized
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
      render :json => { :errors => "Credenciales incorrectas" }, status: :unauthorized
    end
  end

  # POST /api/v1/users/logout
  def logout
    token = Token.find_by(token: bearer_token)
    if token.delete
      render :json => { :message => "El token ha expirado" }
    else
      render :json => { :errors => token.errors.full_messages }
    end
  end

  def show
    user = User.find_by(nick_name: params[:id])
    if @current_user == user
      render :json => user
    else
      render :json => { :message => "Usuario no encontrado" }
    end
  end
end