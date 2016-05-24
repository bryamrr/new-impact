class Api::V1::UsersController < Api::V1::BaseController
  # POST /api/v1/users
  def create
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
  end
end