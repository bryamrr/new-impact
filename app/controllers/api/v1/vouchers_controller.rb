class Api::V1::VouchersController < Api::V1::BaseController
  def index
    @vouchers = Voucher.all
    render :json => @vouchers
  end

  def show
    @voucher = Voucher.find(params[:id])
    render :json => @voucher
  end

  def create
    @voucher = Voucher.new(name: params[:data][:name])

    if @voucher.save
      render :json => @voucher
    else
      render :json => { :errors => @voucher.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @voucher = Voucher.find(params[:id])
    if @current_user.role[:name] = "admin"
      @voucher.update(name: params[:data][:name])
      render :json => @voucher
    else
      render :json => { :error => "No se encontró el voucher" }, status: :not_found
    end
  end

  def destroy
    @voucher = Voucher.find(params[:id])
    if @current_user.role[:name] = "admin"
      @voucher.destroy
      render :json => { :message => "voucher eliminado" }
    else
      render :json => { :errors => "No se encontró el voucher" }, status: :not_found
    end
  end
end