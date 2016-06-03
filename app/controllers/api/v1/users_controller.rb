class Api::V1::UsersController < Api::V1::BaseController
  skip_before_filter :authenticate, :only => [:login, :logout]

  # POST /api/v1/users
  def create
    if @current_user.role[:name] == "Admin"
      if User.exists?(nick_name: params[:data][:nick_name])
        render :json => { :message => "El usuario ya existe" }
      else
        @user = User.new(
          nick_name: params[:data][:nick_name],
          password: params[:data][:password],
          email: params[:data][:email],
          address: params[:data][:address],
          phone: params[:data][:phone],
          role: Role.find(params[:data][:role_id])
          )
        @user.province = Province.find(params[:data][:province_id]) unless params[:data][:province_id] == nil
        @user.company = Company.find(params[:data][:company_id]) unless params[:data][:company_id] == nil
        if @user.save
          render :json => { :message => "Usuario creado correctamente" }, status: :created
        else
          render :json => { :errors => @user.errors.full_messages }, status: :unprocessable_entity
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